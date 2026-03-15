import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());

const WORKSPACE_ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(WORKSPACE_ROOT, 'src');

const openaiApiKey = process.env.OPENAI_API_KEY || '';
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;
const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const maxContextDocs = Number(process.env.AI_MAX_CONTEXT_DOCS || 4);

function listFiles(dir, exts) {
  const results = [];
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(p, exts));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.includes(ext)) results.push(p);
    }
  }
  return results;
}

function loadKnowledgeBase() {
  const kb = [];
  const includeExts = ['.jsx', '.js', '.md'];
  const files = [
    path.join(WORKSPACE_ROOT, 'README.md'),
    ...listFiles(SRC_DIR, includeExts)
  ];
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      kb.push({ file: path.relative(WORKSPACE_ROOT, file), content });
    } catch {}
  }
  return kb;
}

const KNOWLEDGE_BASE = loadKnowledgeBase();

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'how',
  'what', 'when', 'where', 'into', 'have', 'has', 'are', 'can', 'about',
  'use', 'using', 'will', 'does', 'dont', 'not', 'just', 'job', 'jobs'
]);

function tokenize(text) {
  const raw = String(text || '').toLowerCase().match(/[a-zA-Z][a-zA-Z0-9_-]+/g) || [];
  return raw.filter((t) => t.length > 2 && !STOP_WORDS.has(t));
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

  for (const t of queryTokens) {
    const re = new RegExp(`\\b${escapeRegExp(t)}\\b`, 'g');
    const hitCount = (text.match(re) || []).length;
    if (hitCount > 0) {
      matched += 1;
      score += Math.min(hitCount, 5) * 2;
    }
    if (fileName.includes(t)) {
      score += 3;
    }
  }

  if (rawQuery && text.includes(rawQuery.toLowerCase())) {
    score += 8;
  }

  const coverage = matched / queryTokens.length;
  score *= (1 + coverage);

  return score;
}

function extractSnippets(queryTokens, content, maxChars = 1200) {
  const lines = content.split(/\r?\n/);
  const hitIndexes = [];

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (queryTokens.some(t => l.includes(t))) {
      hitIndexes.push(i);
    }
  }

  if (!hitIndexes.length) {
    return lines.slice(0, Math.min(lines.length, 20)).join('\n').slice(0, maxChars);
  }

  // Build merged windows around matched lines to avoid duplicated context.
  const windows = [];
  for (const idx of hitIndexes) {
    const start = Math.max(0, idx - 2);
    const end = Math.min(lines.length - 1, idx + 2);
    const last = windows[windows.length - 1];
    if (last && start <= last.end + 1) {
      last.end = Math.max(last.end, end);
    } else {
      windows.push({ start, end });
    }
  }

  const blocks = windows.slice(0, 8).map((w) => {
    const block = [];
    for (let i = w.start; i <= w.end; i++) {
      block.push(`${i + 1}: ${lines[i]}`);
    }
    return block.join('\n');
  });

  const text = blocks.join('\n---\n');
  return text.slice(0, maxChars);
}

function formatAssistantReply(text) {
  const raw = String(text || '').replace(/\r/g, '').trim();
  if (!raw) return 'No response generated.';

  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const structured = lines.some((l) => /^([0-9]+\.|[-*])\s+/.test(l));
  const capped = lines.slice(0, 8).join('\n').slice(0, 1200);
  if (structured) return capped;

  const sentences = raw
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (!sentences.length) return raw.slice(0, 800);

  return [
    sentences[0],
    ...sentences.slice(1).map((s, i) => `${i + 1}. ${s}`)
  ].join('\n').slice(0, 1200);
}

function buildLocalFallbackReply(query, userType, rankedDocs) {
  const q = String(query || '').toLowerCase();
  const persona = String(userType || '').toLowerCase();
  const files = rankedDocs.slice(0, 3).map(({ doc }) => doc.file);

  let steps;
  if (persona === 'recruiter' && q.includes('post') && q.includes('job')) {
    steps = [
      'Open the recruiter dashboard and go to the Jobs section.',
      'Click Add Job, then fill title, department, location, type, and salary.',
      'Review the form and submit to publish the opening.'
    ];
  } else if (q.includes('search') && q.includes('job')) {
    steps = [
      'Use the search bar for keywords like role, skills, or company.',
      'Apply filters for location, experience, and work mode.',
      'Sort by relevance or newest and open a role card to apply.'
    ];
  } else {
    steps = [
      'Open the related dashboard page for your role.',
      'Use filters or action buttons visible in that page.',
      'If you share your exact goal, I can give precise click-by-click steps.'
    ];
  }

  const lines = [
    'Using local project context (API key not configured).',
    ...steps.map((s, i) => `${i + 1}. ${s}`)
  ];

  if (files.length) {
    lines.push(`Relevant files: ${files.join(', ')}`);
  }

  return lines.join('\n');
}

app.post('/ai/chat', async (req, res) => {
  const { message, userType } = req.body || {};
  const query = String(message || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const queryTokens = tokenize(query);
  const ranked = KNOWLEDGE_BASE
    .map(doc => ({ doc, score: scoreDocument(queryTokens, query, doc) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, maxContextDocs));

  const contextPieces = ranked.map(({ doc }) => {
    const snippet = extractSnippets(queryTokens, doc.content);
    return `File: ${doc.file}\n${snippet}`;
  });

  const contextHeader = contextPieces.length
    ? `Relevant application context (files and snippets):\n\n${contextPieces.join('\n\n')}`
    : 'No directly relevant snippet found. Answer based on general app knowledge.';

  const roleBlock = `SYSTEM ROLE:\nYou are Payout Job AI Assistant, an intelligent in-app guide for the Payout Job portal.\nYour job is to help jobseekers, students, and recruiters use the platform smoothly and understand every feature.`;

  const knowledgeBlock = `Knowledge Base:\n- Jobseeker: create profile, upload resume, search jobs (title/skills/location/salary), apply, track applications, save jobs, view messages/notifications, edit education/experience/skills, build ATS resume (if available), view job details.\n- Recruiter: create employer profile, post jobs, manage listings, search/filter candidates, view/shortlist applications, contact candidates, update job status, edit/delete posts.\n- Technical: React frontend behavior, REST API interactions, form validations, UI events, dashboards, navigation, common errors & solutions.`;

  const responsibilitiesBlock = `Responsibilities:\n- Guide users step-by-step.\n- Explain features clearly.\n- Resolve confusion with practical tips.\n- Adapt guidance for jobseeker vs recruiter vs student.\n- Be accurate to actual features; call out assumptions.\n- Keep answers concise and actionable (Steps, Examples, Tips).`;

  const styleBlock = `Style Rules:\n- Friendly expert; simple language.\n- No backend secrets; no hallucinations.\n- Minimal jargon unless requested.\n- Keep responses concise: max 6 bullet points or steps.\n- Prefer action-oriented numbered steps when giving guidance.`;

  const persona = String(userType || '').toLowerCase();
  const personaBlock = persona === 'recruiter'
    ? 'Persona: Recruiter — answer like a hiring assistant. Focus on posting jobs, managing applications, shortlisting, contacting candidates.'
    : persona === 'student'
      ? 'Persona: Student — answer like a career mentor. Focus on profile building, internships, skill development.'
      : 'Persona: Jobseeker — answer like a job coach. Focus on searching, applying, improving profile, tracking status.';

  const systemPrompt = [roleBlock, knowledgeBlock, responsibilitiesBlock, styleBlock, personaBlock].join('\n\n');

  if (!openai) {
    const fallback = buildLocalFallbackReply(query, userType, ranked);
    return res.json({ reply: fallback });
  }

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextHeader },
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: openaiModel,
      temperature: 0.2,
      messages
    });

    const replyRaw = completion.choices?.[0]?.message?.content || 'No response generated.';
    const reply = formatAssistantReply(replyRaw);
    return res.json({ reply });
  } catch (err) {
    const msg = typeof err?.message === 'string' ? err.message : 'OpenAI error';
    return res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
