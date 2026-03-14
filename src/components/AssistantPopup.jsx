import React, { useState, useMemo, useEffect, useRef } from 'react';

const panelStyle = {
  position: 'fixed',
  right: 0,
  top: 0,
  height: '100vh',
  width: '420px',
  background: '#fff',
  boxShadow: '-6px 0 30px rgba(0,0,0,0.12)',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  boxSizing: 'border-box'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const fieldStyle = { marginBottom: '12px' };

const footerStyle = { display: 'flex', gap: '8px', marginTop: '12px' };

export default function AssistantPopup({ visible, job, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [animate, setAnimate] = useState(true);
  const advanceTimer = useRef(null);
  const [showFinalPrompt, setShowFinalPrompt] = useState(false);
  const containerRef = useRef(null);
  const FINAL_AFTER = 5; // show final message after this many answers

  // Build question list (add more questions here)
  const questions = useMemo(() => {
    const qs = [];
    if (job?.experience) qs.push({ key: 'experience', type: 'number', label: `Total experience (years) — required: ${job.experience}` });
    const isRemote = (job?.location || '').toLowerCase().includes('remote') || (job?.type || '').toLowerCase() === 'remote';
    if (!isRemote) qs.push({ key: 'relocate', type: 'choice', label: 'Are you willing to relocate?', choices: ['yes', 'no', 'skip'] });
    qs.push({ key: 'noticePeriod', type: 'text', label: 'Notice period (e.g. 30 days) — if any' });
    qs.push({ key: 'ctc', type: 'text', label: 'Current CTC' });
    qs.push({ key: 'preferredLocation', type: 'text', label: 'Preferred work location' });
    qs.push({ key: 'skills', type: 'text', label: 'Key skills (comma separated)' });
    qs.push({ key: 'notes', type: 'textarea', label: 'Any message to recruiter (optional)' });
    return qs;
  }, [job]);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 20);
    return () => clearTimeout(t);
  }, [currentStep]);

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0);
      setAnswers({});
    }
  }, [visible]);

  // show final prompt when enough answers collected
  useEffect(() => {
    const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;
    if (answeredCount >= FINAL_AFTER) {
      setShowFinalPrompt(true);
    }
  }, [answers]);

  if (!visible) return null;

  const total = questions.length;
  const step = questions[currentStep];

  const updateAnswer = (key, value, options = { immediate: false }) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    // clear any pending auto-advance
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    const q = questions.find(q => q.key === key);
    const isValid = validateAnswer(q, value);
    if (!isValid) return;
    if (options.immediate) {
      // immediate advance (used for Enter)
      setTimeout(() => goNext(), 80);
      return;
    }
    // Only auto-advance for choice selections; text/number/textarea require Enter (or Ctrl+Enter)
    if (q?.type === 'choice') {
      advanceTimer.current = setTimeout(() => goNext(), 220);
    }
  };

  const validateAnswer = (question, value) => {
    if (!question) return false;
    if (question.type === 'number') {
      if (value === undefined || value === null || value === '') return false;
      return !isNaN(Number(value));
    }
    if (question.type === 'choice') {
      return ['yes', 'no', 'skip'].includes(String(value));
    }
    // text/textarea: treat non-empty as valid
    if (question.type === 'text' || question.type === 'textarea') {
      return String(value || '').trim().length > 0 || question.key === 'notes';
    }
    return false;
  };

  const goNext = () => {
    if (currentStep < total - 1) setCurrentStep(s => s + 1);
    else handleFinish();
  };

  const checkEligibility = (jobObj = {}, ans = {}) => {
    // basic client-side checks: experience and relocate
    const result = { ok: true };
    if (jobObj?.experience) {
      const nums = String(jobObj.experience).match(/\d+/g);
      const min = nums && nums[0] ? Number(nums[0]) : 0;
      const max = nums && nums[1] ? Number(nums[1]) : null;
      const expAns = ans.experience !== undefined ? Number(ans.experience) : null;
      if (expAns !== null && !isNaN(expAns)) {
        if (expAns < min || (max !== null && expAns > max)) {
          return { ok: false, reason: 'Experience requirement not met' };
        }
      }
    }
    const isRemote = (jobObj?.location || '').toLowerCase().includes('remote') || (jobObj?.type || '').toLowerCase() === 'remote';
    if (!isRemote) {
      const rel = String(ans.relocate || '').toLowerCase();
      if (rel === 'no') return { ok: false, reason: 'Not willing to relocate' };
    }
    return result;
  };

  const handleFinish = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    const eligibility = checkEligibility(job || {}, answers);
    if (!eligibility.ok) {
      setSubmissionStatus('rejected');
      setSubmissionMessage(eligibility.reason ? `You are not eligible — ${eligibility.reason}` : 'You are not eligible for this job');
      if (onSubmit) onSubmit(job?.id, answers, { eligible: false, reason: eligibility.reason });
      return;
    }
    setSubmissionStatus('success');
    setSubmissionMessage('You are eligible — opening application page...');
    if (onSubmit) onSubmit(job?.id, answers, { eligible: true });
    setTimeout(() => {
      onClose && onClose();
    }, 900);
  };

  const handleManualClose = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    onClose && onClose();
  };

  return (
    <div style={panelStyle} role="dialog" aria-modal="true" aria-label="Application assistant">
      <div style={headerStyle}>
        <div>
          <strong>Hi — I'll help with your application</strong>
          <div style={{ fontSize: 12, color: '#666' }}>{job?.title || ''}{job?.company ? ` at ${job.company}` : ''}</div>
        </div>
        <button onClick={handleManualClose} aria-label="Close" style={{ background: 'transparent', border: 'none', fontSize: 18 }}>×</button>
      </div>

      <div ref={containerRef} style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>Application assistant</div>

        {questions.slice(0, currentStep).map((q) => (
          <div key={q.key} style={{ padding: 12, borderRadius: 10, background: '#fbfafc', border: '1px solid #eef2f6' }}>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>{q.label}</div>
            <div style={{ marginTop: 8, color: '#0f172a' }}>{String(answers[q.key] ?? '') || <span style={{ color: '#94a3b8' }}>No answer</span>}</div>
          </div>
        ))}

        {/* final prompt (visible once threshold reached) */}
        {showFinalPrompt && (
            <div style={{ padding: 12, borderRadius: 10, background: '#fffbeb', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#92400e' }}>Ready to submit</div>
              <div style={{ color: '#92400e' }}>You've answered {Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length} questions.</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={handleFinish} style={{ width: '100%', background: '#b45309', color: '#fff', padding: '10px 12px', borderRadius: 8, border: 'none' }}>Submit</button>
              </div>
            </div>
        )}

        {/* current question */}
        {step && (
            <div
              key={step.key}
              style={{
                padding: 14,
                borderRadius: 10,
                background: '#ffffff',
                border: '1px solid #e6eef2',
                transition: 'transform 220ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease',
                transform: animate ? 'translateY(0px) scale(1)' : 'translateY(8px) scale(0.98)',
                opacity: animate ? 1 : 0
              }}
            >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{step.label}</div>

            {step.type === 'number' && (
              <input
                autoFocus
                type="number"
                value={answers[step.key] || ''}
                onChange={e => updateAnswer(step.key, e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') updateAnswer(step.key, e.target.value, { immediate: true }); }}
                placeholder="e.g. 3"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6e6e6' }}
              />
            )}

            {step.type === 'choice' && (
              <div>
                {step.choices.map(choice => (
                  <label key={choice} style={{ display: 'block', marginBottom: 8 }}>
                    <input type="radio" name={step.key} value={choice} checked={(answers[step.key] || '') === choice} onChange={e => updateAnswer(step.key, e.target.value)} />
                    <span style={{ marginLeft: 8 }}>{choice === 'yes' ? 'Yes' : choice === 'no' ? 'No' : 'Skip'}</span>
                  </label>
                ))}
              </div>
            )}

            {step.type === 'text' && (
              <input
                autoFocus
                type="text"
                value={answers[step.key] || ''}
                onChange={e => updateAnswer(step.key, e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') updateAnswer(step.key, e.target.value, { immediate: true }); }}
                placeholder="Type your answer"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6e6e6' }}
              />
            )}

            {step.type === 'textarea' && (
              <textarea
                autoFocus
                value={answers[step.key] || ''}
                onChange={e => updateAnswer(step.key, e.target.value)}
                onKeyDown={e => { if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey))) updateAnswer(step.key, e.target.value, { immediate: true }); }}
                rows={4}
                placeholder="Type your message (optional) — press Ctrl+Enter to send"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e6e6e6' }}
              />
            )}
          </div>
        )}
      </div>

      {submissionStatus && (
        <div style={{ marginTop: 10 }}>
          <div style={{ padding: 12, borderRadius: 8, background: submissionStatus === 'success' ? '#ecfdf5' : '#fffbeb', border: '1px solid', borderColor: submissionStatus === 'success' ? '#bbf7d0' : '#fef3c7', color: submissionStatus === 'success' ? '#065f46' : '#92400e', fontWeight: 700 }}>
            {submissionMessage}
          </div>
        </div>
      )}

      <div style={{ paddingTop: 10 }}>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>Answers are captured automatically — no Next button needed.</div>
      </div>
    </div>
  );
}
