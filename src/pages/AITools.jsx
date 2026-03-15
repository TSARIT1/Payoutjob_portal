import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  autofillAiApplication,
  enhanceAiCv,
  generateAiJobPosting,
  getAiReferralInsights,
  screenAiApplication,
  tailorAiResume
} from '../services/api';
import './AITools.css';

const defaultError = 'Request failed. Please try again.';

function AiSection({ title, subtitle, children }) {
  return (
    <section className="ai-section-card">
      <div className="ai-section-head">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function AITools() {
  const [jobInput, setJobInput] = useState({ title: '', department: '', location: '', type: 'Full-time', experience: '' });
  const [jobDraft, setJobDraft] = useState(null);

  const [screeningInput, setScreeningInput] = useState({ jobDescription: '', candidateProfile: '' });
  const [screeningResult, setScreeningResult] = useState(null);

  const [autofillText, setAutofillText] = useState('');
  const [autofillResult, setAutofillResult] = useState(null);

  const [tailorInput, setTailorInput] = useState({ resumeText: '', jobDescription: '' });
  const [tailorResult, setTailorResult] = useState(null);

  const [referralInput, setReferralInput] = useState({ company: '', role: '' });
  const [referralResult, setReferralResult] = useState([]);

  const [cvInput, setCvInput] = useState({ cvText: '', jobTitle: '', requiredSkills: '' });
  const [cvResult, setCvResult] = useState(null);

  const [status, setStatus] = useState({ type: '', message: '' });

  async function withStatus(action) {
    setStatus({ type: '', message: '' });
    try {
      await action();
      setStatus({ type: 'success', message: 'AI action completed successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error?.response?.data?.error || defaultError });
    }
  }

  return (
    <>
      <Navbar />
      <main className="ai-tools-page">
        <header className="ai-hero">
          <div>
            <p className="ai-kicker">Free AI-Powered Job Site</p>
            <h1>24/7 AI Career Copilot</h1>
            <p>
              Add intelligence to your hiring and job search workflow with AI job posting, AI screening,
              Click Application Autofill, Job Specific Tailored Resume, insider referral guidance, and AI CV enhancement.
            </p>
          </div>
        </header>

        <div className="ai-feature-strip">
          <div className="ai-feature-chip">AI job posting</div>
          <div className="ai-feature-chip">AI screening and finalizing</div>
          <div className="ai-feature-chip">Click Application Autofill</div>
          <div className="ai-feature-chip">Job Specific Tailored Resume</div>
          <div className="ai-feature-chip">Get Your Insider Referrals</div>
          <div className="ai-feature-chip">24/7 AI Career Copilot</div>
        </div>

        {status.message ? (
          <div className={`ai-status ${status.type === 'error' ? 'error' : 'success'}`}>{status.message}</div>
        ) : null}

        <div className="ai-grid">
          <AiSection
            title="AI Job Posting"
            subtitle="Generate structured professional job drafts from role basics."
          >
            <div className="ai-form-grid">
              <input value={jobInput.title} onChange={(e) => setJobInput((p) => ({ ...p, title: e.target.value }))} placeholder="Job title" />
              <input value={jobInput.department} onChange={(e) => setJobInput((p) => ({ ...p, department: e.target.value }))} placeholder="Department" />
              <input value={jobInput.location} onChange={(e) => setJobInput((p) => ({ ...p, location: e.target.value }))} placeholder="Location" />
              <input value={jobInput.experience} onChange={(e) => setJobInput((p) => ({ ...p, experience: e.target.value }))} placeholder="Experience" />
              <select value={jobInput.type} onChange={(e) => setJobInput((p) => ({ ...p, type: e.target.value }))}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
              <button onClick={() => withStatus(async () => {
                const data = await generateAiJobPosting(jobInput);
                setJobDraft(data.draft);
              })}>Generate Draft</button>
            </div>
            {jobDraft ? (
              <div className="ai-result-block">
                <h4>{jobDraft.title}</h4>
                <p>{jobDraft.summary}</p>
                <strong>Responsibilities</strong>
                <ul>{jobDraft.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
                <strong>Requirements</strong>
                <ul>{jobDraft.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </AiSection>

          <AiSection
            title="AI Screening and Finalizing"
            subtitle="Score candidate-job fit and identify missing skills instantly."
          >
            <textarea value={screeningInput.jobDescription} onChange={(e) => setScreeningInput((p) => ({ ...p, jobDescription: e.target.value }))} placeholder="Paste job description" rows={4} />
            <textarea value={screeningInput.candidateProfile} onChange={(e) => setScreeningInput((p) => ({ ...p, candidateProfile: e.target.value }))} placeholder="Paste candidate profile/resume summary" rows={4} />
            <button onClick={() => withStatus(async () => {
              const data = await screenAiApplication(screeningInput);
              setScreeningResult(data.analysis);
            })}>Run AI Screening</button>
            {screeningResult ? (
              <div className="ai-result-block">
                <div className="fit-score">Fit Score: {screeningResult.fitScore}%</div>
                <p>{screeningResult.recommendation}</p>
                <strong>Matched Skills</strong>
                <p>{screeningResult.matchedSkills.join(', ') || 'No strong matches detected.'}</p>
                <strong>Missing Skills</strong>
                <p>{screeningResult.missingSkills.join(', ') || 'No critical missing skills.'}</p>
              </div>
            ) : null}
          </AiSection>

          <AiSection
            title="Click Application Autofill"
            subtitle="Extract name, email, phone, and skills from resume text in one click."
          >
            <textarea value={autofillText} onChange={(e) => setAutofillText(e.target.value)} placeholder="Paste resume text" rows={6} />
            <button onClick={() => withStatus(async () => {
              const data = await autofillAiApplication({ resumeText: autofillText });
              setAutofillResult(data.fields);
            })}>Autofill from Resume</button>
            {autofillResult ? (
              <div className="ai-result-block">
                <p><strong>Name:</strong> {autofillResult.name || '-'}</p>
                <p><strong>Email:</strong> {autofillResult.email || '-'}</p>
                <p><strong>Phone:</strong> {autofillResult.phone || '-'}</p>
                <p><strong>Skills:</strong> {(autofillResult.skills || []).join(', ') || '-'}</p>
              </div>
            ) : null}
          </AiSection>

          <AiSection
            title="Job Specific Tailored Resume"
            subtitle="Tailor resume bullets and close skill gaps for each application."
          >
            <textarea value={tailorInput.resumeText} onChange={(e) => setTailorInput((p) => ({ ...p, resumeText: e.target.value }))} placeholder="Current resume text" rows={4} />
            <textarea value={tailorInput.jobDescription} onChange={(e) => setTailorInput((p) => ({ ...p, jobDescription: e.target.value }))} placeholder="Target job description" rows={4} />
            <button onClick={() => withStatus(async () => {
              const data = await tailorAiResume(tailorInput);
              setTailorResult(data.tailored);
            })}>Generate Tailored Resume Guidance</button>
            {tailorResult ? (
              <div className="ai-result-block">
                <strong>Matched Skills</strong>
                <p>{tailorResult.matchedSkills.join(', ') || '-'}</p>
                <strong>Missing Skills</strong>
                <p>{tailorResult.missingSkills.join(', ') || '-'}</p>
                <strong>Tailored Bullets</strong>
                <ul>{tailorResult.tailoredBullets.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </AiSection>

          <AiSection
            title="Get Your Insider Referrals"
            subtitle="Get practical referral outreach strategy and follow-up steps."
          >
            <div className="ai-form-grid">
              <input value={referralInput.company} onChange={(e) => setReferralInput((p) => ({ ...p, company: e.target.value }))} placeholder="Target company" />
              <input value={referralInput.role} onChange={(e) => setReferralInput((p) => ({ ...p, role: e.target.value }))} placeholder="Target role" />
              <button onClick={() => withStatus(async () => {
                const data = await getAiReferralInsights(referralInput);
                setReferralResult(data.insights || []);
              })}>Get Referral Plan</button>
            </div>
            {referralResult.length ? <ul className="ai-result-list">{referralResult.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </AiSection>

          <AiSection
            title="AI CV Enhancer"
            subtitle="Explore our CV enhancement tools and take your CV to new heights"
          >
            <div className="ai-cv-grid">
              <textarea value={cvInput.cvText} onChange={(e) => setCvInput((p) => ({ ...p, cvText: e.target.value }))} placeholder="Paste your CV text" rows={6} />
              <input value={cvInput.jobTitle} onChange={(e) => setCvInput((p) => ({ ...p, jobTitle: e.target.value }))} placeholder="Target job title" />
              <input value={cvInput.requiredSkills} onChange={(e) => setCvInput((p) => ({ ...p, requiredSkills: e.target.value }))} placeholder="Required skills (comma separated)" />
              <button onClick={() => withStatus(async () => {
                const data = await enhanceAiCv(cvInput);
                setCvResult(data.result);
              })}>Run CV Enhancer</button>
            </div>
            {cvResult ? (
              <div className="ai-result-block">
                <h4>Spelling Check</h4>
                <ul>{cvResult.spellingCheck.map((item) => <li key={item}>{item}</li>)}</ul>
                <h4>Grammar Check</h4>
                <ul>{cvResult.grammarCheck.map((item) => <li key={item}>{item}</li>)}</ul>
                <h4>Profile Objective</h4>
                <p>{cvResult.profileObjective}</p>
                <h4>Suggested Skill</h4>
                <ul>{cvResult.suggestedSkill.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </AiSection>
        </div>
      </main>
      <Footer />
    </>
  );
}
