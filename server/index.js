import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OpenAI from 'openai';
import { config } from './lib/config.js';
import { initializeDatabase, getDatabaseState, parseJson, query } from './lib/database.js';
import { demoCredentials } from './lib/demoData.js';
import {
  getDefaultEmailTemplates,
  getEmailConfigState,
  populateEmailTemplate,
  sendManagedEmail
} from './lib/emailService.js';

await initializeDatabase();

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cors());

const WORKSPACE_ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(WORKSPACE_ROOT, 'src');

const openai = config.openaiApiKey ? new OpenAI({ apiKey: config.openaiApiKey }) : null;

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'how',
  'what', 'when', 'where', 'into', 'have', 'has', 'are', 'can', 'about',
  'use', 'using', 'will', 'does', 'dont', 'not', 'just', 'job', 'jobs'
]);

function listFiles(dir, exts) {
  const results = [];
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(filePath, exts));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      results.push(filePath);
    }
  }
  return results;
}

function loadKnowledgeBase() {
  const files = [
    path.join(WORKSPACE_ROOT, 'README.md'),
    ...listFiles(SRC_DIR, ['.jsx', '.js', '.md', '.css'])
  ];

  return files.flatMap((file) => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return [{ file: path.relative(WORKSPACE_ROOT, file), content }];
    } catch {
      return [];
    }
  });
}

const KNOWLEDGE_BASE = loadKnowledgeBase();

function tokenize(text) {
  const raw = String(text || '').toLowerCase().match(/[a-zA-Z][a-zA-Z0-9_-]+/g) || [];
  return raw.filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scoreDocument(queryTokens, rawQuery, doc) {
  if (!queryTokens.length) return 0;

  const fileName = String(doc.file || '').toLowerCase();
  const text = String(doc.content || '').toLowerCase();
  let score = 0;
  let matched = 0;

  for (const token of queryTokens) {
    const re = new RegExp(`\\b${escapeRegExp(token)}\\b`, 'g');
    const hitCount = (text.match(re) || []).length;
    if (hitCount > 0) {
      matched += 1;
      score += Math.min(hitCount, 5) * 2;
    }
    if (fileName.includes(token)) {
      score += 3;
    }
  }

  if (rawQuery && text.includes(rawQuery.toLowerCase())) {
    score += 8;
  }

  return score * (1 + matched / queryTokens.length);
}

function extractSnippets(queryTokens, content, maxChars = 1200) {
  const lines = String(content || '').split(/\r?\n/);
  const hitIndexes = [];

  for (let index = 0; index < lines.length; index += 1) {
    const lower = lines[index].toLowerCase();
    if (queryTokens.some((token) => lower.includes(token))) {
      hitIndexes.push(index);
    }
  }

  if (!hitIndexes.length) {
    return lines.slice(0, Math.min(20, lines.length)).join('\n').slice(0, maxChars);
  }

  const windows = [];
  for (const index of hitIndexes) {
    const start = Math.max(0, index - 2);
    const end = Math.min(lines.length - 1, index + 2);
    const last = windows[windows.length - 1];
    if (last && start <= last.end + 1) {
      last.end = Math.max(last.end, end);
    } else {
      windows.push({ start, end });
    }
  }

  const merged = windows.slice(0, 8).map((window) => {
    const block = [];
    for (let index = window.start; index <= window.end; index += 1) {
      block.push(`${index + 1}: ${lines[index]}`);
    }
    return block.join('\n');
  });

  return merged.join('\n---\n').slice(0, maxChars);
}

function formatAssistantReply(text) {
  const raw = String(text || '').replace(/\r/g, '').trim();
  if (!raw) return 'No response generated.';

  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
  const structured = lines.some((line) => /^([0-9]+\.|[-*])\s+/.test(line));
  if (structured) {
    return lines.slice(0, 8).join('\n').slice(0, 1200);
  }

  const sentences = raw.split(/(?<=[.!?])\s+/).map((entry) => entry.trim()).filter(Boolean).slice(0, 4);
  if (!sentences.length) {
    return raw.slice(0, 800);
  }

  return [sentences[0], ...sentences.slice(1).map((sentence, index) => `${index + 1}. ${sentence}`)].join('\n').slice(0, 1200);
}

function splitSkillTokens(text) {
  const tokens = tokenize(text);
  const unique = new Set(tokens);
  return Array.from(unique);
}

function extractNamedSkills(text) {
  const known = [
    'react', 'node', 'nodejs', 'javascript', 'typescript', 'python', 'java',
    'sql', 'mysql', 'postgresql', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'html', 'css', 'figma', 'seo', 'excel', 'powerbi', 'tableau', 'communication'
  ];
  const lower = String(text || '').toLowerCase();
  return known.filter((skill) => lower.includes(skill));
}

function buildCvEnhancement(cvText, jobTitle, requiredSkillsRaw) {
  const text = String(cvText || '');
  const lower = text.toLowerCase();
  const misspellings = {
    recieve: 'receive',
    experiance: 'experience',
    seperate: 'separate',
    acheived: 'achieved',
    managment: 'management'
  };

  const spellingIssues = Object.entries(misspellings)
    .filter(([wrong]) => lower.includes(wrong))
    .map(([wrong, correct]) => `${wrong} -> ${correct}`);

  const grammarIssues = [];
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  for (const sentence of sentences.slice(0, 30)) {
    const trimmed = sentence.trim();
    if (trimmed && /^[a-z]/.test(trimmed)) {
      grammarIssues.push(`Sentence should start with uppercase: "${trimmed.slice(0, 60)}"`);
    }
    if (/\b(\w+)\s+\1\b/i.test(trimmed)) {
      grammarIssues.push(`Repeated word found: "${trimmed.slice(0, 60)}"`);
    }
  }

  const requiredSkills = splitSkillTokens(requiredSkillsRaw || '').slice(0, 20);
  const presentSkills = new Set(extractNamedSkills(cvText));
  const suggestedSkills = requiredSkills
    .filter((skill) => !presentSkills.has(skill))
    .slice(0, 8);

  const profileObjective = `Results-oriented professional seeking ${jobTitle || 'a target role'} opportunity, bringing strong ownership, measurable outcomes, and collaboration across product, engineering, and operations.`;

  return {
    spellingCheck: spellingIssues.length ? spellingIssues : ['No obvious spelling issues found.'],
    grammarCheck: grammarIssues.length ? grammarIssues.slice(0, 8) : ['No major grammar issues found.'],
    profileObjective,
    suggestedSkill: suggestedSkills.length ? suggestedSkills : ['Add role-specific and measurable skills aligned to job requirements.']
  };
}

function extractAutofill(resumeText) {
  const text = String(resumeText || '');
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
  const phone = text.match(/(\+?\d[\d\s-]{8,}\d)/)?.[0] || '';
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const name = lines.find((line) => /^[A-Za-z][A-Za-z\s.]{2,40}$/.test(line)) || '';
  const skills = extractNamedSkills(text).slice(0, 10);
  return { name, email, phone, skills };
}

function buildTailoredResume(resumeText, jobDescription) {
  const resumeSkills = new Set(extractNamedSkills(resumeText));
  const jobSkills = extractNamedSkills(jobDescription);
  const prioritySkills = jobSkills.filter((skill) => !resumeSkills.has(skill)).slice(0, 6);
  const matchedSkills = jobSkills.filter((skill) => resumeSkills.has(skill)).slice(0, 6);

  const bullets = [
    'Add a results summary in the top section with quantified impact (%, revenue, time saved).',
    ...matchedSkills.map((skill) => `Highlight a project bullet proving hands-on ${skill} impact.`),
    ...prioritySkills.map((skill) => `Add evidence or training for ${skill} to align with this job.`)
  ].slice(0, 8);

  return {
    matchedSkills,
    missingSkills: prioritySkills,
    tailoredBullets: bullets
  };
}

function buildScreening(jobDescription, candidateProfile) {
  const jobSkills = extractNamedSkills(jobDescription);
  const candidateSkills = new Set(extractNamedSkills(candidateProfile));
  const matched = jobSkills.filter((skill) => candidateSkills.has(skill));
  const missing = jobSkills.filter((skill) => !candidateSkills.has(skill));
  const fitScore = jobSkills.length ? Math.round((matched.length / jobSkills.length) * 100) : 60;
  const recommendation = fitScore >= 75 ? 'Strong shortlist' : fitScore >= 50 ? 'Consider for interview with targeted screening' : 'Needs upskilling before shortlist';

  return {
    fitScore,
    recommendation,
    matchedSkills: matched,
    missingSkills: missing.slice(0, 8)
  };
}

function buildJobPostingDraft(input) {
  const role = input.title || 'Professional';
  const department = input.department || 'Operations';
  const location = input.location || 'Remote';
  const type = input.type || 'Full-time';
  const experience = input.experience || '2-4 years';

  return {
    title: role,
    department,
    location,
    type,
    experience,
    summary: `We are hiring a ${role} to join our ${department} team. This ${type} role is based in ${location}.`,
    responsibilities: [
      'Deliver high-quality outcomes with clear ownership and timelines.',
      'Collaborate across product, design, engineering, and operations.',
      'Analyze performance metrics and continuously improve execution.'
    ],
    requirements: [
      `${experience} of relevant experience in a similar role.`,
      'Strong communication and stakeholder management skills.',
      'Proven ability to execute in fast-paced environments.'
    ]
  };
}

function buildLocalFallbackReply(query, userType, rankedDocs) {
  const lowerQuery = String(query || '').toLowerCase();
  const persona = String(userType || '').toLowerCase();
  const files = rankedDocs.slice(0, 3).map(({ doc }) => doc.file);
  let steps;

  if (persona === 'recruiter' && lowerQuery.includes('post') && lowerQuery.includes('job')) {
    steps = [
      'Open the recruiter dashboard and go to Job Postings.',
      'Click Add New Job and complete the title, department, location, salary, and requirements.',
      'Set the status to Open and save to publish the role.'
    ];
  } else if (lowerQuery.includes('apply')) {
    steps = [
      'Open a job card and choose Apply.',
      'Answer the assistant prompts so the portal can validate your application.',
      'Submit and review the application status from the Applied Jobs page.'
    ];
  } else {
    steps = [
      'Open the relevant dashboard page for your role.',
      'Use the visible filters and action buttons to complete the task.',
      'Ask a more specific question if you want step-by-step guidance.'
    ];
  }

  const response = ['Using local project context (API key not configured).', ...steps.map((step, index) => `${index + 1}. ${step}`)];
  if (files.length) {
    response.push(`Relevant files: ${files.join(', ')}`);
  }
  return response.join('\n');
}

function normalizeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

function normalizeObject(value, fallback = {}) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
}

function buildUserFromRecord(record) {
  const storedProfile = normalizeObject(parseJson(record.profile_json, {}), {});
  const personalInfo = normalizeObject(storedProfile.personalInfo, {});
  const careerProfile = normalizeObject(storedProfile.careerProfile, {});
  const avatar = record.avatar_url || personalInfo.image || storedProfile.logo || '';
  const location = record.location || personalInfo.location || storedProfile.location || '';

  const baseUser = {
    id: record.id,
    name: record.full_name,
    email: record.email,
    phone: record.phone || '',
    avatar,
    role: record.role,
    location,
    title: record.title || '',
    profileCompletion: record.profile_completion || 0,
    profileCompleted: Boolean(record.profile_completed)
  };

  if (record.role === 'Employer') {
    return {
      ...baseUser,
      companyName: record.company_name || storedProfile.name || record.full_name,
      dashboardPreferences: normalizeObject(storedProfile.dashboardPreferences, { theme: 'light', lastLogin: null }),
      ...storedProfile
    };
  }

  return {
    ...baseUser,
    university: record.university || '',
    headline: personalInfo.headline || careerProfile.role || record.title || '',
    skills: normalizeArray(storedProfile.skills),
    experience: normalizeArray(storedProfile.experience),
    education: normalizeArray(storedProfile.education),
    projects: normalizeArray(storedProfile.projects),
    languages: normalizeArray(storedProfile.languages),
    socialLinks: normalizeObject(storedProfile.socialLinks),
    resume: storedProfile.resume || null,
    personalInfo: {
      name: personalInfo.name || record.full_name,
      headline: personalInfo.headline || record.title || '',
      location: personalInfo.location || location,
      email: personalInfo.email || record.email,
      phone: personalInfo.phone || record.phone || '',
      image: personalInfo.image || avatar,
      dob: personalInfo.dob || '',
      gender: personalInfo.gender || '',
      maritalStatus: personalInfo.maritalStatus || ''
    },
    careerProfile,
    ...storedProfile
  };
}

async function getUserRecordById(userId) {
  const rows = await query(
    `SELECT u.*, p.profile_json, p.profile_completion, p.profile_completed
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.id = ?
     LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

async function getUserRecordByEmail(email, role) {
  const params = [email];
  let sql = `SELECT u.*, p.profile_json, p.profile_completion, p.profile_completed
             FROM users u
             LEFT JOIN user_profiles p ON p.user_id = u.id
             WHERE u.email = ?`;

  if (role) {
    sql += ' AND u.role = ?';
    params.push(role);
  }

  sql += ' LIMIT 1';
  const rows = await query(sql, params);
  return rows[0] || null;
}

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
}

function extractSalaryValue(salary) {
  const numbers = String(salary || '').match(/\d+/g);
  if (!numbers?.length) return 0;
  return numbers.map(Number).reduce((sum, value) => sum + value, 0) / numbers.length;
}

function mapJobRecord(record) {
  return {
    id: record.id,
    employerId: record.employer_id,
    title: record.title,
    department: record.department,
    subtitle: `${record.company_name || record.employer_name || 'Employer'} • ${record.department}`,
    companyName: record.company_name || record.employer_name || 'Employer',
    location: record.location,
    type: record.type,
    status: record.status,
    salary: record.salary,
    salaryValue: extractSalaryValue(record.salary),
    experience: record.experience,
    description: record.description || '',
    requirements: record.requirements || '',
    applications: Number(record.applications || 0),
    postedDate: record.created_at,
    datePosted: record.created_at
  };
}

function mapEmployerApplication(record) {
  const studentProfile = normalizeObject(parseJson(record.student_profile_json, {}), {});
  return {
    id: record.id,
    jobId: record.job_id,
    candidateName: record.student_name,
    candidateEmail: record.student_email,
    candidateLocation: record.student_location || studentProfile.personalInfo?.location || '',
    status: record.status,
    appliedDate: record.created_at,
    experience: normalizeArray(studentProfile.experience).map((entry) => entry.duration).filter(Boolean).join(', ') || 'Not specified',
    skills: normalizeArray(studentProfile.skills),
    cvUrl: studentProfile.resume?.dataUrl || null,
    notes: record.recruiter_note || '',
    candidateNote: record.candidate_note || '',
    responses: parseJson(record.response_json, null),
    interviewSchedule: record.schedule_date ? {
      date: record.schedule_date,
      type: record.schedule_type || 'video'
    } : null
  };
}

function mapStudentApplication(record) {
  return {
    id: record.id,
    jobId: record.job_id,
    title: record.title,
    company: record.company_name || record.employer_name,
    location: record.location,
    salary: record.salary,
    postedDate: record.job_created_at,
    appliedDate: record.created_at,
    experience: record.experience,
    type: record.type,
    status: record.status === 'review' ? 'under-review' : record.status === 'interview' ? 'interview-scheduled' : record.status,
    description: record.description,
    logo: 'https://via.placeholder.com/60x60/1f4b99/ffffff?text=PJ'
  };
}

function ensureDbReady(res) {
  const state = getDatabaseState();
  if (state.ready) return true;
  res.status(503).json({ error: `MySQL is not connected. ${state.error || ''}`.trim() });
  return false;
}

function authRequired(allowedRoles = []) {
  return async (req, res, next) => {
    if (!ensureDbReady(res)) return;

    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
      return res.status(401).json({ error: 'Missing authentication token' });
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const userRecord = await getUserRecordById(decoded.sub);
      if (!userRecord) {
        return res.status(401).json({ error: 'User session is invalid' });
      }
      req.authUser = buildUserFromRecord(userRecord);
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.authUser.role)) {
        return res.status(403).json({ error: 'Access denied for this role' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function buildInitialProfile(role, payload) {
  if (role === 'Employer') {
    return {
      name: payload.companyName || payload.fullName || 'Your Company',
      industry: payload.industry || 'Technology',
      size: payload.size || '11-50 employees',
      website: payload.website || '',
      location: payload.location || 'Bangalore, India',
      logo: '',
      description: 'Tell candidates what makes your company worth joining.',
      contactEmail: payload.email,
      contactPhone: payload.phone || '',
      companyType: payload.companyType || 'Private',
      hrName: payload.fullName || 'Hiring Manager',
      officialEmail: payload.email,
      designation: payload.designation || 'Talent Acquisition Lead',
      dashboardPreferences: {
        theme: 'light',
        lastLogin: null
      }
    };
  }

  return {
    personalInfo: {
      name: payload.fullName,
      headline: payload.headline || 'Aspiring professional',
      location: payload.location || 'Bangalore, India',
      email: payload.email,
      phone: payload.phone || '',
      image: ''
    },
    careerProfile: {
      summary: 'Add your goals, strengths, and preferred opportunities.',
      currentIndustry: 'Technology',
      functionalArea: 'Engineering',
      role: payload.headline || 'Student',
      jobType: 'Permanent',
      employmentType: 'Full Time',
      desiredSalary: '',
      desiredLocation: payload.location || 'Bangalore',
      noticePeriod: 'Immediate'
    },
    education: payload.university ? [{ degree: 'Student', university: payload.university, year: '', completed: false }] : [],
    experience: [],
    projects: [],
    skills: [],
    languages: [],
    socialLinks: {},
    resume: null
  };
}

async function upsertProfile(userId, profileJson, profileCompletion, profileCompleted) {
  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       profile_json = VALUES(profile_json),
       profile_completion = VALUES(profile_completion),
       profile_completed = VALUES(profile_completed)`,
    [userId, JSON.stringify(profileJson), profileCompletion, profileCompleted ? 1 : 0]
  );
}

app.get('/api/health', asyncRoute(async (_req, res) => {
  res.json({
    ok: true,
    database: getDatabaseState(),
    ai: {
      enabled: Boolean(openai)
    },
    email: getEmailConfigState(),
    demoCredentials
  });
}));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  if (!ensureDbReady(res)) return;

  const role = req.body.role || (req.body.companyName ? 'Employer' : 'Student');
  const fullName = req.body.fullName || req.body.name || req.body.companyName;
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const phone = String(req.body.phone || '').trim();
  const companyName = req.body.companyName || null;
  const university = req.body.university || null;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email, and password are required.' });
  }

  const existingUser = await getUserRecordByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (role, full_name, email, password_hash, phone, university, company_name, title, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      role,
      fullName,
      email,
      passwordHash,
      phone,
      role === 'Student' ? university : null,
      role === 'Employer' ? companyName : null,
      req.body.title || null,
      req.body.location || null
    ]
  );

  const profile = buildInitialProfile(role, { ...req.body, fullName, email, phone, companyName, university });
  await upsertProfile(result.insertId, profile, role === 'Employer' ? 70 : 40, false);

  const userRecord = await getUserRecordById(result.insertId);
  const user = buildUserFromRecord(userRecord);
  const token = createToken(user);
  res.status(201).json({ token, user, message: 'Account created successfully.' });
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  if (!ensureDbReady(res)) return;

  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = req.body.role || null;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const userRecord = await getUserRecordByEmail(email, role);
  if (!userRecord) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, userRecord.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const user = buildUserFromRecord(userRecord);
  const token = createToken(user);
  res.json({ token, user, message: 'Login successful.' });
}));

app.get('/api/auth/me', authRequired(), asyncRoute(async (req, res) => {
  res.json({ user: req.authUser });
}));

app.put('/api/auth/profile', authRequired(), asyncRoute(async (req, res) => {
  const currentRecord = await getUserRecordById(req.authUser.id);
  const currentProfile = normalizeObject(parseJson(currentRecord.profile_json, {}), {});

  const nextProfile = {
    ...currentProfile,
    ...req.body,
    personalInfo: req.body.personalInfo
      ? { ...normalizeObject(currentProfile.personalInfo, {}), ...req.body.personalInfo }
      : normalizeObject(currentProfile.personalInfo, {}),
    careerProfile: req.body.careerProfile
      ? { ...normalizeObject(currentProfile.careerProfile, {}), ...req.body.careerProfile }
      : normalizeObject(currentProfile.careerProfile, {}),
    socialLinks: req.body.socialLinks
      ? { ...normalizeObject(currentProfile.socialLinks, {}), ...req.body.socialLinks }
      : normalizeObject(currentProfile.socialLinks, {})
  };

  const fullName = req.body.name || nextProfile.personalInfo?.name || currentRecord.full_name;
  const email = req.body.email || nextProfile.personalInfo?.email || currentRecord.email;
  const phone = req.body.phone || nextProfile.personalInfo?.phone || currentRecord.phone;
  const location = req.body.location || nextProfile.personalInfo?.location || nextProfile.location || currentRecord.location;
  const avatar = req.body.avatar || nextProfile.personalInfo?.image || nextProfile.logo || currentRecord.avatar_url;
  const title = req.body.headline || nextProfile.personalInfo?.headline || nextProfile.designation || currentRecord.title;
  const companyName = req.authUser.role === 'Employer'
    ? (req.body.companyName || nextProfile.name || currentRecord.company_name)
    : currentRecord.company_name;
  const university = req.authUser.role === 'Student'
    ? (req.body.university || nextProfile.education?.[0]?.university || currentRecord.university)
    : currentRecord.university;

  await query(
    `UPDATE users
     SET full_name = ?, email = ?, phone = ?, university = ?, company_name = ?, title = ?, location = ?, avatar_url = ?
     WHERE id = ?`,
    [fullName, email, phone, university, companyName, title, location, avatar, req.authUser.id]
  );

  await upsertProfile(
    req.authUser.id,
    nextProfile,
    req.body.profileCompletion ?? req.authUser.profileCompletion ?? 0,
    req.body.profileCompleted ?? req.authUser.profileCompleted ?? false
  );

  const updatedRecord = await getUserRecordById(req.authUser.id);
  res.json({ user: buildUserFromRecord(updatedRecord), message: 'Profile updated.' });
}));

app.get('/api/jobs', asyncRoute(async (_req, res) => {
  if (!ensureDbReady(res)) return;
  const rows = await query(
    `SELECT j.*, u.company_name, u.full_name AS employer_name, COUNT(a.id) AS applications
     FROM jobs j
     INNER JOIN users u ON u.id = j.employer_id
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE j.status = 'active'
     GROUP BY j.id
     ORDER BY j.created_at DESC`
  );

  res.json({ jobs: rows.map(mapJobRecord) });
}));

app.post('/api/jobs/:jobId/apply', authRequired(['Student']), asyncRoute(async (req, res) => {
  const jobId = Number(req.params.jobId);
  const jobRows = await query('SELECT * FROM jobs WHERE id = ? AND status = ?', [jobId, 'active']);
  if (!jobRows[0]) {
    return res.status(404).json({ error: 'Job not found or not open for applications.' });
  }

  const existing = await query('SELECT id FROM applications WHERE job_id = ? AND student_id = ? LIMIT 1', [jobId, req.authUser.id]);
  if (existing[0]) {
    return res.status(409).json({ error: 'You have already applied to this job.' });
  }

  await query(
    `INSERT INTO applications (job_id, student_id, status, candidate_note, response_json)
     VALUES (?, ?, 'review', ?, ?)`,
    [jobId, req.authUser.id, req.body.candidateNote || '', JSON.stringify(req.body.responses || null)]
  );

  res.status(201).json({ message: 'Application submitted successfully.' });
}));

app.get('/api/applications/me', authRequired(['Student']), asyncRoute(async (req, res) => {
  const rows = await query(
    `SELECT a.*, j.title, j.location, j.salary, j.experience, j.type, j.description, j.created_at AS job_created_at,
            u.company_name, u.full_name AS employer_name
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     INNER JOIN users u ON u.id = j.employer_id
     WHERE a.student_id = ?
     ORDER BY a.created_at DESC`,
    [req.authUser.id]
  );

  res.json({ applications: rows.map(mapStudentApplication) });
}));

app.get('/api/employer/dashboard', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const jobRows = await query(
    `SELECT j.*, COUNT(a.id) AS applications, u.company_name, u.full_name AS employer_name
     FROM jobs j
     INNER JOIN users u ON u.id = j.employer_id
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE j.employer_id = ?
     GROUP BY j.id
     ORDER BY j.created_at DESC`,
    [req.authUser.id]
  );

  const applicationRows = await query(
    `SELECT a.*, j.title, j.department, j.location, j.type, j.salary, j.created_at AS job_created_at,
            s.full_name AS student_name, s.email AS student_email, s.location AS student_location,
            p.profile_json AS student_profile_json
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     INNER JOIN users s ON s.id = a.student_id
     LEFT JOIN user_profiles p ON p.user_id = s.id
     WHERE j.employer_id = ?
     ORDER BY a.created_at DESC`,
    [req.authUser.id]
  );

  const jobs = jobRows.map(mapJobRecord);
  const applications = applicationRows.map(mapEmployerApplication);
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((job) => job.status === 'active').length,
    totalApplications: applications.length,
    hiredCandidates: applications.filter((application) => application.status === 'hired').length
  };

  res.json({
    profile: req.authUser,
    jobs,
    applications,
    stats,
    emailTemplates: getDefaultEmailTemplates()
  });
}));

app.get('/api/employer/email-history', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const rows = await query(
    `SELECT *
     FROM email_messages
     WHERE employer_id = ?
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.authUser.id]
  );

  res.json({
    emails: rows.map((row) => ({
      id: row.id,
      applicationId: row.application_id,
      recipientEmail: row.recipient_email,
      recipientName: row.recipient_name,
      subject: row.subject,
      bodyText: row.body_text,
      templateKey: row.template_key,
      status: row.status,
      providerMessageId: row.provider_message_id,
      providerResponse: row.provider_response,
      createdAt: row.created_at
    })),
    templates: getDefaultEmailTemplates(),
    config: getEmailConfigState()
  });
}));

app.post('/api/employer/send-email', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const applicationId = req.body.applicationId ? Number(req.body.applicationId) : null;
  let applicationRecord = null;

  if (applicationId) {
    const rows = await query(
      `SELECT a.id, a.job_id, s.full_name AS candidate_name, s.email AS candidate_email, j.title AS job_title
       FROM applications a
       INNER JOIN jobs j ON j.id = a.job_id
       INNER JOIN users s ON s.id = a.student_id
       WHERE a.id = ? AND j.employer_id = ?
       LIMIT 1`,
      [applicationId, req.authUser.id]
    );
    applicationRecord = rows[0] || null;
  }

  const recipientEmail = String(req.body.recipientEmail || applicationRecord?.candidate_email || '').trim();
  const recipientName = String(req.body.recipientName || applicationRecord?.candidate_name || '').trim();
  const subjectInput = String(req.body.subject || '').trim();
  const bodyInput = String(req.body.body || '').trim();
  const templateKey = String(req.body.templateKey || '').trim() || null;

  if (!recipientEmail || !subjectInput || !bodyInput) {
    return res.status(400).json({ error: 'Recipient email, subject, and body are required.' });
  }

  const variables = {
    candidateName: recipientName || 'Candidate',
    companyName: req.authUser.companyName || req.authUser.name || 'Payout',
    senderName: req.authUser.hrName || req.authUser.name || 'Hiring Team',
    jobTitle: req.body.jobTitle || applicationRecord?.job_title || 'the role'
  };

  const subject = populateEmailTemplate(subjectInput, variables);
  const bodyText = populateEmailTemplate(bodyInput, variables);

  let delivery;
  try {
    delivery = await sendManagedEmail({
      to: recipientEmail,
      subject,
      text: bodyText,
      html: `<div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap">${bodyText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`
    });
  } catch (error) {
    delivery = {
      status: 'failed',
      providerMessageId: null,
      providerResponse: error instanceof Error ? error.message : 'Unknown email error'
    };
  }

  const result = await query(
    `INSERT INTO email_messages (employer_id, application_id, recipient_email, recipient_name, subject, body_text, template_key, status, provider_message_id, provider_response)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.authUser.id,
      applicationId,
      recipientEmail,
      recipientName,
      subject,
      bodyText,
      templateKey,
      delivery.status,
      delivery.providerMessageId,
      delivery.providerResponse
    ]
  );

  res.status(delivery.status === 'failed' ? 502 : 201).json({
    message: delivery.status === 'sent'
      ? 'Email sent successfully.'
      : delivery.status === 'simulated'
        ? 'SMTP is not configured yet. Email was saved in history as a simulated send.'
        : 'Email delivery failed and was logged.',
    email: {
      id: result.insertId,
      applicationId,
      recipientEmail,
      recipientName,
      subject,
      bodyText,
      templateKey,
      status: delivery.status,
      providerMessageId: delivery.providerMessageId,
      providerResponse: delivery.providerResponse
    }
  });
}));

app.post('/api/employer/jobs', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const result = await query(
    `INSERT INTO jobs (employer_id, title, department, location, type, status, salary, experience, description, requirements)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.authUser.id,
      req.body.title,
      req.body.department,
      req.body.location,
      req.body.type,
      req.body.status || 'draft',
      req.body.salary || '',
      req.body.experience || '',
      req.body.description || '',
      req.body.requirements || ''
    ]
  );

  const rows = await query(
    `SELECT j.*, u.company_name, u.full_name AS employer_name, 0 AS applications
     FROM jobs j
     INNER JOIN users u ON u.id = j.employer_id
     WHERE j.id = ?`,
    [result.insertId]
  );

  res.status(201).json({ job: mapJobRecord(rows[0]), message: 'Job created successfully.' });
}));

app.put('/api/employer/jobs/:jobId', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const jobId = Number(req.params.jobId);
  const ownedJob = await query('SELECT id FROM jobs WHERE id = ? AND employer_id = ? LIMIT 1', [jobId, req.authUser.id]);
  if (!ownedJob[0]) {
    return res.status(404).json({ error: 'Job not found.' });
  }

  await query(
    `UPDATE jobs
     SET title = ?, department = ?, location = ?, type = ?, status = ?, salary = ?, experience = ?, description = ?, requirements = ?
     WHERE id = ? AND employer_id = ?`,
    [
      req.body.title,
      req.body.department,
      req.body.location,
      req.body.type,
      req.body.status,
      req.body.salary || '',
      req.body.experience || '',
      req.body.description || '',
      req.body.requirements || '',
      jobId,
      req.authUser.id
    ]
  );

  const rows = await query(
    `SELECT j.*, u.company_name, u.full_name AS employer_name,
            (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) AS applications
     FROM jobs j
     INNER JOIN users u ON u.id = j.employer_id
     WHERE j.id = ?`,
    [jobId]
  );

  res.json({ job: mapJobRecord(rows[0]), message: 'Job updated successfully.' });
}));

app.delete('/api/employer/jobs/:jobId', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const jobId = Number(req.params.jobId);
  await query('DELETE FROM jobs WHERE id = ? AND employer_id = ?', [jobId, req.authUser.id]);
  res.json({ message: 'Job deleted successfully.' });
}));

app.patch('/api/employer/applications/:applicationId', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const applicationId = Number(req.params.applicationId);
  const rows = await query(
    `SELECT a.id
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     WHERE a.id = ? AND j.employer_id = ?
     LIMIT 1`,
    [applicationId, req.authUser.id]
  );

  if (!rows[0]) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  await query(
    `UPDATE applications
     SET status = ?, recruiter_note = ?, schedule_date = ?, schedule_type = ?
     WHERE id = ?`,
    [
      req.body.status || 'review',
      req.body.notes || '',
      req.body.scheduleData?.date ? new Date(req.body.scheduleData.date) : null,
      req.body.scheduleData?.type || null,
      applicationId
    ]
  );

  res.json({ message: 'Application updated successfully.' });
}));

app.post('/api/ai/job-posting', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const draft = buildJobPostingDraft(req.body || {});
  res.json({ draft });
}));

app.post('/api/ai/screen-application', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const jobDescription = String(req.body?.jobDescription || '');
  const candidateProfile = String(req.body?.candidateProfile || '');
  if (!jobDescription || !candidateProfile) {
    return res.status(400).json({ error: 'jobDescription and candidateProfile are required.' });
  }
  const analysis = buildScreening(jobDescription, candidateProfile);
  res.json({ analysis });
}));

app.post('/api/ai/cv-enhance', authRequired(), asyncRoute(async (req, res) => {
  const cvText = String(req.body?.cvText || '');
  if (!cvText) {
    return res.status(400).json({ error: 'cvText is required.' });
  }
  const result = buildCvEnhancement(cvText, req.body?.jobTitle, req.body?.requiredSkills);
  res.json({ result });
}));

app.post('/api/ai/autofill-application', authRequired(), asyncRoute(async (req, res) => {
  const resumeText = String(req.body?.resumeText || '');
  if (!resumeText) {
    return res.status(400).json({ error: 'resumeText is required.' });
  }
  const fields = extractAutofill(resumeText);
  res.json({ fields });
}));

app.post('/api/ai/tailor-resume', authRequired(), asyncRoute(async (req, res) => {
  const resumeText = String(req.body?.resumeText || '');
  const jobDescription = String(req.body?.jobDescription || '');
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'resumeText and jobDescription are required.' });
  }
  const tailored = buildTailoredResume(resumeText, jobDescription);
  res.json({ tailored });
}));

app.post('/api/ai/referral-insights', authRequired(), asyncRoute(async (req, res) => {
  const company = String(req.body?.company || 'target company');
  const role = String(req.body?.role || 'target role');
  const insights = [
    `Identify 5 employees at ${company} in or near ${role} on LinkedIn.`,
    'Send a concise outreach message with shared context and specific ask (15-minute chat).',
    'Prepare a referral packet: tailored resume, portfolio links, and role-fit bullets.',
    'Follow up after 4-5 business days with one clear update and gratitude note.'
  ];
  res.json({ insights });
}));

app.post('/ai/chat', asyncRoute(async (req, res) => {
  const queryText = String(req.body?.message || '').trim();
  const userType = req.body?.userType;
  if (!queryText) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const queryTokens = tokenize(queryText);
  const ranked = KNOWLEDGE_BASE
    .map((doc) => ({ doc, score: scoreDocument(queryTokens, queryText, doc) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.max(1, config.aiMaxContextDocs));

  const contextPieces = ranked.map(({ doc }) => `File: ${doc.file}\n${extractSnippets(queryTokens, doc.content)}`);
  const contextHeader = contextPieces.length
    ? `Relevant application context (files and snippets):\n\n${contextPieces.join('\n\n')}`
    : 'No directly relevant snippet found. Answer based on general application knowledge.';

  const persona = String(userType || '').toLowerCase();
  const personaBlock = persona === 'recruiter'
    ? 'Persona: Recruiter. Focus on posting jobs, managing candidates, and hiring workflow.'
    : persona === 'student'
      ? 'Persona: Student. Focus on profile building, internships, and growth advice.'
      : 'Persona: Jobseeker. Focus on search, application steps, and profile quality.';

  const systemPrompt = [
    'You are Payout Job AI Assistant.',
    'Guide users with practical steps using only the available app features.',
    'Keep replies concise and action-oriented.',
    'Use at most 6 bullets or numbered steps.',
    personaBlock
  ].join('\n');

  if (!openai) {
    return res.json({ reply: buildLocalFallbackReply(queryText, userType, ranked) });
  }

  const completion = await openai.chat.completions.create({
    model: config.openaiModel,
    temperature: 0.2,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextHeader },
      { role: 'user', content: queryText }
    ]
  });

  const reply = formatAssistantReply(completion.choices?.[0]?.message?.content || 'No response generated.');
  res.json({ reply });
}));

// ── Saved Jobs ──────────────────────────────────────────────────────────────
app.get('/api/jobs/saved', authRequired(['Student']), asyncRoute(async (req, res) => {
  const rows = await query(
    `SELECT j.*, u.company_name, u.full_name AS employer_name, COUNT(a.id) AS applications
     FROM saved_jobs sj
     INNER JOIN jobs j ON j.id = sj.job_id
     INNER JOIN users u ON u.id = j.employer_id
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE sj.user_id = ? AND j.status = 'active'
     GROUP BY j.id
     ORDER BY sj.created_at DESC`,
    [req.authUser.id]
  );
  res.json({ jobs: rows.map(mapJobRecord) });
}));

app.post('/api/jobs/:jobId/save', authRequired(['Student']), asyncRoute(async (req, res) => {
  const jobId = Number(req.params.jobId);
  const jobRows = await query('SELECT id FROM jobs WHERE id = ? LIMIT 1', [jobId]);
  if (!jobRows[0]) return res.status(404).json({ error: 'Job not found.' });
  await query(
    'INSERT IGNORE INTO saved_jobs (user_id, job_id) VALUES (?, ?)',
    [req.authUser.id, jobId]
  );
  res.json({ message: 'Job saved.' });
}));

app.delete('/api/jobs/:jobId/save', authRequired(['Student']), asyncRoute(async (req, res) => {
  const jobId = Number(req.params.jobId);
  await query('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [req.authUser.id, jobId]);
  res.json({ message: 'Job removed from saved.' });
}));

// ── Job Alerts ───────────────────────────────────────────────────────────────
app.get('/api/job-alerts', authRequired(['Student']), asyncRoute(async (req, res) => {
  const rows = await query(
    'SELECT * FROM job_alerts WHERE user_id = ? ORDER BY created_at DESC',
    [req.authUser.id]
  );
  res.json({ alerts: rows });
}));

app.post('/api/job-alerts', authRequired(['Student']), asyncRoute(async (req, res) => {
  const keyword = String(req.body.keyword || '').trim();
  const email = String(req.body.email || req.authUser.email || '').trim();
  const frequency = ['Daily', 'Weekly', 'Monthly'].includes(req.body.frequency)
    ? req.body.frequency : 'Daily';
  if (!keyword || !email) return res.status(400).json({ error: 'Keyword and email are required.' });
  const result = await query(
    'INSERT INTO job_alerts (user_id, keyword, email, frequency) VALUES (?, ?, ?, ?)',
    [req.authUser.id, keyword, email, frequency]
  );
  res.status(201).json({ message: `Alert created for "${keyword}".`, id: result.insertId });
}));

app.delete('/api/job-alerts/:alertId', authRequired(['Student']), asyncRoute(async (req, res) => {
  await query(
    'DELETE FROM job_alerts WHERE id = ? AND user_id = ?',
    [Number(req.params.alertId), req.authUser.id]
  );
  res.json({ message: 'Alert deleted.' });
}));

// ── Recommended Jobs ─────────────────────────────────────────────────────────
app.get('/api/jobs/recommended', authRequired(['Student']), asyncRoute(async (req, res) => {
  const record = await getUserRecordById(req.authUser.id);
  const profile = normalizeObject(parseJson(record?.profile_json, {}), {});
  const skills = normalizeArray(profile.skills).map((s) => String(s).toLowerCase()).filter(Boolean);

  const rows = await query(
    `SELECT j.*, u.company_name, u.full_name AS employer_name, COUNT(a.id) AS applications
     FROM jobs j
     INNER JOIN users u ON u.id = j.employer_id
     LEFT JOIN applications a ON a.job_id = j.id
     WHERE j.status = 'active'
     GROUP BY j.id
     ORDER BY j.created_at DESC
     LIMIT 50`,
    []
  );

  const scored = rows.map((row) => {
    const text = `${row.title} ${row.description || ''} ${row.requirements || ''}`.toLowerCase();
    const score = skills.reduce((sum, skill) => sum + (text.includes(skill) ? 1 : 0), 0);
    return { row, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const recommended = scored.slice(0, 10).map(({ row }) => mapJobRecord(row));
  res.json({ jobs: recommended });
}));

// ── Blog Posts ───────────────────────────────────────────────────────────────
app.get('/api/blog-posts', asyncRoute(async (_req, res) => {
  if (!ensureDbReady(res)) return;
  const rows = await query(
    `SELECT bp.*, u.full_name AS author_name
     FROM blog_posts bp
     INNER JOIN users u ON u.id = bp.user_id
     ORDER BY bp.created_at DESC
     LIMIT 100`
  );
  const posts = rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author_name,
    tags: normalizeArray(parseJson(row.tags_json, [])),
    readTime: row.read_time,
    publishedAt: row.created_at
  }));
  res.json({ posts });
}));

app.post('/api/blog-posts', authRequired(['Student']), asyncRoute(async (req, res) => {
  const title = String(req.body.title || '').trim();
  const excerpt = String(req.body.excerpt || '').trim();
  const content = String(req.body.content || '').trim();
  const tags = normalizeArray(req.body.tags);
  const readTime = String(req.body.readTime || '3 min').trim();
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  const result = await query(
    `INSERT INTO blog_posts (user_id, author_name, title, excerpt, content, tags_json, read_time)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.authUser.id, req.authUser.name, title, excerpt, content, JSON.stringify(tags), readTime]
  );
  res.status(201).json({ message: 'Post published.', id: result.insertId });
}));

// ── Notifications ────────────────────────────────────────────────────────────
app.get('/api/notifications', authRequired(['Student']), asyncRoute(async (req, res) => {
  const rows = await query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [req.authUser.id]
  );
  res.json({ notifications: rows });
}));

app.patch('/api/notifications/:notifId/read', authRequired(['Student']), asyncRoute(async (req, res) => {
  await query(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [Number(req.params.notifId), req.authUser.id]
  );
  res.json({ message: 'Notification marked as read.' });
}));

app.patch('/api/notifications/read-all', authRequired(['Student']), asyncRoute(async (req, res) => {
  await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.authUser.id]);
  res.json({ message: 'All notifications marked as read.' });
}));

// ── Employer: Candidate Search ───────────────────────────────────────────────
app.get('/api/employer/candidates', authRequired(['Employer']), asyncRoute(async (req, res) => {
  const keyword = String(req.query.keyword || '').trim().toLowerCase();
  const location = String(req.query.location || '').trim().toLowerCase();
  const rows = await query(
    `SELECT u.id, u.full_name, u.email, u.phone, u.location, u.title, u.avatar_url,
            p.profile_json, p.profile_completion
     FROM users u
     LEFT JOIN user_profiles p ON p.user_id = u.id
     WHERE u.role = 'Student'
     ORDER BY p.profile_completion DESC
     LIMIT 100`,
    []
  );
  const candidates = rows
    .map((row) => {
      const profile = normalizeObject(parseJson(row.profile_json, {}), {});
      const skills = normalizeArray(profile.skills).map((s) => String(s).toLowerCase());
      const resumeText = `${row.full_name} ${row.title || ''} ${(skills).join(' ')} ${row.location || ''}`.toLowerCase();
      return { row, profile, skills, resumeText };
    })
    .filter(({ resumeText, row }) => {
      const matchesKeyword = !keyword || resumeText.includes(keyword);
      const matchesLocation = !location || (row.location || '').toLowerCase().includes(location);
      return matchesKeyword && matchesLocation;
    })
    .slice(0, 20)
    .map(({ row, profile, skills }) => ({
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone || '',
      location: row.location || '',
      title: row.title || '',
      avatar: row.avatar_url || profile.personalInfo?.image || '',
      skills,
      profileCompletion: row.profile_completion || 0,
      experience: normalizeArray(profile.experience).length
    }));
  res.json({ candidates });
}));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected server error' });
});

app.listen(config.port, () => {
  const dbState = getDatabaseState();
  console.log(`API server running on http://localhost:${config.port}`);
  console.log(dbState.ready ? `MySQL connected: ${config.mysql.database}` : `MySQL unavailable: ${dbState.error || 'unknown error'}`);
});
