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

function tokenize(text) {
  return text.toLowerCase().match(/[a-zA-Z][a-zA-Z0-9_-]+/g) || [];
}

function scoreDocument(queryTokens, doc) {
  const docTokens = tokenize(doc.content);
  if (!docTokens.length) return 0;
  let score = 0;
  const set = new Set(docTokens);
  for (const t of queryTokens) {
    if (set.has(t)) score += 1;
  }
  return score;
}

function extractSnippets(queryTokens, content, maxChars = 1200) {
  const lines = content.split(/\r?\n/);
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (queryTokens.some(t => l.includes(t))) {
      const start = Math.max(0, i - 2);
      const end = Math.min(lines.length, i + 3);
      hits.push(lines.slice(start, end).join('\n'));
    }
  }
  const text = hits.join('\n---\n');
  return text.slice(0, maxChars);
}

app.post('/ai/chat', async (req, res) => {
  const { message, userType } = req.body || {};
  const query = String(message || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Missing message' });
  }

  const queryTokens = tokenize(query);
  const ranked = KNOWLEDGE_BASE
    .map(doc => ({ doc, score: scoreDocument(queryTokens, doc) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

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

  const styleBlock = `Style Rules:\n- Friendly expert; simple language.\n- No backend secrets; no hallucinations.\n- Minimal jargon unless requested.\n- Provide steps and options where helpful.`;

  const persona = String(userType || '').toLowerCase();
  const personaBlock = persona === 'recruiter'
    ? 'Persona: Recruiter — answer like a hiring assistant. Focus on posting jobs, managing applications, shortlisting, contacting candidates.'
    : persona === 'student'
      ? 'Persona: Student — answer like a career mentor. Focus on profile building, internships, skill development.'
      : 'Persona: Jobseeker — answer like a job coach. Focus on searching, applying, improving profile, tracking status.';

  const systemPrompt = [roleBlock, knowledgeBlock, responsibilitiesBlock, styleBlock, personaBlock].join('\n\n');

  if (!openai) {
    const fallback = `AI key missing. Using local context only.\n\n${contextHeader}\n\n` +
      `Question: ${query}\n\n` +
      `Summary: This is a React + Vite job portal. Review the provided context files and respond with a helpful, concise answer. If the context is insufficient, say what is known and what to check next.`;
    return res.json({ reply: fallback });
  }

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextHeader },
      { role: 'user', content: query }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages
    });

    const reply = completion.choices?.[0]?.message?.content || 'No response generated.';
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
