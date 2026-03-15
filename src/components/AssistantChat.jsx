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
      const resp = await fetch(`${AI_SERVER_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, userType: persona })
      });
      const data = await resp.json();
      const reply = data.reply || data.error || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
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
        <div className="fixed bottom-5 right-5 z-[9999]">
          <div className="relative">
            <div className="assistant-badge absolute -top-2 -right-1 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">AI</div>
            <button
              onClick={() => setOpen(true)}
              className="assistant-halo w-16 h-16 rounded-full shadow-2xl text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 flex items-center justify-center border border-white/30 transition-transform hover:scale-105 active:scale-95"
              aria-label="Open Payout Assistant"
              title="Ask Payout"
            >
              <Bot className="w-7 h-7 drop-shadow" />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[92vw]">
          <div className="rounded-2xl shadow-2xl border overflow-hidden bg-white">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <div>
                  <div className="text-sm font-semibold">Payout Assistant</div>
                  <div className="text-[11px] opacity-90">Friendly AI guide for your portal</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1 text-xs">
                  <PersonaIcon />
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="bg-transparent text-white outline-none"
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
                <button className="p-1 hover:bg-white/20 rounded" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Suggestions */}
            <div className="px-3 py-2 border-b bg-gray-50 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => pickSuggestion(s)}
                  className="text-xs px-2 py-1 rounded-full border bg-white hover:bg-gray-100"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div ref={listRef} className="h-72 overflow-y-auto p-4 space-y-3 bg-white">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'assistant' ? '' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl shadow ${
                      m.role === 'assistant'
                        ? 'bg-gray-50 text-gray-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="animate-pulse">Thinking…</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t bg-gray-50">
              <input
                className="flex-1 border rounded-full px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ask anything about the app…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                className="px-4 py-2 rounded-full text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
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
