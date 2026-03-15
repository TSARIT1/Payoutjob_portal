import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, X, User, Briefcase } from 'lucide-react';

const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:3001';

export default function AssistantChat({ userType = 'jobseeker' }) {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState(userType);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your Payout Job AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const suggestions = persona === 'recruiter'
    ? ['Post a job', 'Manage applications', 'Shortlist candidates', 'Close a job']
    : ['Search jobs', 'Apply to a job', 'Track applications', 'Improve resume'];

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const streamResp = await fetch(`${AI_SERVER_URL}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userType: persona })
      });
      if (!streamResp.ok || !streamResp.body) {
        const fallbackResp = await fetch(`${AI_SERVER_URL}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, userType: persona })
        });
        const fallbackData = await fallbackResp.json();
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackData.reply || fallbackData.error || 'No response.' }]);
      } else {
        let buffer = '';
        const decoder = new TextDecoder('utf-8');
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
        const reader = streamResp.body.getReader();
        // Read SSE chunks and progressively update assistant text.
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));
          for (const line of lines) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (!payload.done) {
                buffer = `${buffer}${buffer ? ' ' : ''}${payload.token}`;
                setMessages(prev => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: buffer };
                  return next;
                });
              }
            } catch {
              // Ignore malformed stream events and continue.
            }
          }
        }
      }
    } catch (_err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Unable to reach AI server. Make sure it is running.' }]);
    } finally {
      setLoading(false);
    }
  }

  function pickSuggestion(text) {
    setInput(text);
  }

  function PersonaIcon() {
    if (persona === 'recruiter') return <Briefcase className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  }

  return (
    <>
      {!open && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -8, right: -4, fontSize: 10, fontWeight: 700, color: '#3730a3', background: '#fff', borderRadius: 999, padding: '2px 6px', border: '1px solid #e2e8f0' }}>AI</div>
            <button
              onClick={() => setOpen(true)}
              style={{ width: 62, height: 62, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 12px 28px rgba(79,70,229,0.35)', background: 'linear-gradient(135deg,#4f46e5,#7c3aed,#ec4899)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              aria-label="Open Payout Assistant"
              title="Ask Payout"
            >
              <Bot size={26} />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999, width: 380, maxWidth: '95vw' }}>
          <div style={{ borderRadius: 16, boxShadow: '0 20px 40px rgba(15,23,42,0.25)', border: '1px solid #cbd5e1', overflow: 'hidden', background: '#fff' }}>
            {/* Header */}
            <div style={{ padding: '10px 12px', background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#ec4899)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={18} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Payout Assistant</div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>Friendly AI guide for your portal</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, borderRadius: 999, padding: '4px 8px', background: 'rgba(255,255,255,0.2)' }}>
                  <PersonaIcon />
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: 12 }}
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
                <button style={{ border: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 5, color: '#fff', cursor: 'pointer' }} onClick={() => setOpen(false)} aria-label="Close">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div style={{ padding: 10, borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => pickSuggestion(s)}
                  style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div ref={listRef} style={{ height: 290, overflowY: 'auto', padding: 12, background: '#fff' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'assistant' ? 'flex-start' : 'flex-end', marginBottom: 8 }}>
                  <div
                    style={{ maxWidth: '82%', padding: '8px 10px', borderRadius: 14, boxShadow: '0 1px 4px rgba(15,23,42,0.08)', background: m.role === 'assistant' ? '#f8fafc' : '#4f46e5', color: m.role === 'assistant' ? '#1e293b' : '#fff', whiteSpace: 'pre-wrap', lineHeight: 1.4, fontSize: 13 }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <input
                style={{ flex: 1, border: '1px solid #cbd5e1', borderRadius: 999, padding: '8px 12px', fontSize: 13, outline: 'none' }}
                placeholder="Ask anything about the app…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                style={{ border: 'none', borderRadius: 999, padding: '8px 14px', fontSize: 13, color: '#fff', cursor: 'pointer', background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#ec4899)' }}
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
