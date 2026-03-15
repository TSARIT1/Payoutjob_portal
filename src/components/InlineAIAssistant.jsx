import { useEffect, useMemo, useRef, useState } from 'react';
import { FiZap, FiSend, FiUser, FiBriefcase, FiRefreshCw } from 'react-icons/fi';
import './InlineAIAssistant.css';

const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:3001';

export default function InlineAIAssistant({
  userType = 'jobseeker',
  title = 'AI Assistant',
  subtitle = 'Get smart, role-specific guidance in real time.',
  compact = false
}) {
  const [persona, setPersona] = useState(userType);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: userType === 'recruiter'
        ? 'Hi, I can help with job posting, screening, candidate messaging, and hiring workflow strategy.'
        : 'Hi, I can help with profile improvements, resume guidance, job targeting, and application strategy.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setPersona(userType);
  }, [userType]);

  const suggestions = useMemo(() => {
    if (persona === 'recruiter') {
      return [
        'Write a strong job description for Frontend Developer.',
        'How should I shortlist candidates quickly?',
        'Draft a professional interview invite email.',
        'How can I improve employer response time?'
      ];
    }

    return [
      'How can I improve my profile for better visibility?',
      'Suggest resume bullet points for React developer.',
      'How should I prepare for a recruiter screening call?',
      'What jobs should I target based on my profile?'
    ];
  }, [persona]);

  const clearConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: persona === 'recruiter'
          ? 'Conversation reset. Ask me anything about recruiting workflow, hiring quality, or employer operations.'
          : 'Conversation reset. Ask me anything about your job search, profile quality, or application strategy.'
      }
    ]);
    setInput('');
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
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
        setMessages((prev) => [...prev, { role: 'assistant', content: fallbackData.reply || fallbackData.error || 'No response.' }]);
      } else {
        const reader = streamResp.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

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
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { role: 'assistant', content: buffer };
                  return next;
                });
              }
            } catch {
              // Ignore malformed events and continue.
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'AI server is unavailable. Please make sure backend is running on port 3001.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`inline-ai ${compact ? 'compact' : ''}`}>
      <header className="inline-ai-header">
        <div>
          <h3><FiZap /> {title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="inline-ai-controls">
          <label>
            {persona === 'recruiter' ? <FiBriefcase /> : <FiUser />}
            <select value={persona} onChange={(e) => setPersona(e.target.value)}>
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
          <button type="button" onClick={clearConversation} title="Reset conversation">
            <FiRefreshCw /> Reset
          </button>
        </div>
      </header>

      <div className="inline-ai-suggestions">
        {suggestions.map((item) => (
          <button key={item} type="button" onClick={() => setInput(item)}>{item}</button>
        ))}
      </div>

      <div className="inline-ai-messages" ref={listRef}>
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`inline-ai-bubble ${message.role}`}>
            {message.content}
          </div>
        ))}
        {loading && <div className="inline-ai-thinking">Thinking...</div>}
      </div>

      <form className="inline-ai-input" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={persona === 'recruiter' ? 'Ask about hiring workflow...' : 'Ask about your job search...'}
        />
        <button type="submit" disabled={loading}>
          <FiSend /> Send
        </button>
      </form>
    </section>
  );
}