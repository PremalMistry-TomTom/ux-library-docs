import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── Icons ─────────────────────────────────────────────────────────────── */
function SparkleIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.22 3.22l2.12 2.12M10.66 10.66l2.12 2.12M3.22 12.78l2.12-2.12M10.66 5.34l2.12-2.12"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8L2.5 2.5l2.8 5.5-2.8 5.5L13.5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getPageContext() {
  const headings = [...document.querySelectorAll('.page h2, .page h3')]
    .map(h => h.textContent.trim())
    .filter(Boolean)
    .slice(0, 6);
  const intro = document.querySelector('.page .quick-answer')?.textContent?.trim() ?? '';
  return { headings, intro };
}

const DEMO_RESPONSES = [
  (ctx) => {
    const topics = ctx.headings.slice(0, 4).join(', ');
    return topics
      ? `This page covers ${topics}. I can answer questions about any of these sections — what would you like to dig into?`
      : `I have full context for this page. What would you like to know?`;
  },
  () => `That's a great question. In a production integration you'd connect this panel to your AI endpoint and pass it the page markdown as context. The "Copy for LLM" button above copies exactly the right format.`,
  () => `This is a prototype panel — wire up a real endpoint (OpenAI, Claude, Gemini) in \`AskAIPanel.jsx\` to get live answers. The page text is already extracted and ready to use as the system prompt.`,
  () => `For OEM integrations, the recommended pattern is to use the page content as a retrieval chunk in a RAG pipeline so responses stay accurate to the SDK version being documented.`,
];

/* ─── Typing indicator ───────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="ai-msg ai-msg--ai ai-msg--typing" aria-label="AI is thinking">
      <span /><span /><span />
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────────────────────────────── */
function Message({ role, text }) {
  return (
    <div className={`ai-msg ai-msg--${role}`}>
      {role === 'ai' && (
        <span className="ai-msg-avatar"><SparkleIcon size={12} /></span>
      )}
      <span className="ai-msg-text">{text}</span>
    </div>
  );
}

/* ─── Panel ──────────────────────────────────────────────────────────────── */
export default function AskAIPanel({ isOpen, onClose, pageTitle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const responseIndexRef = useRef(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Reset conversation when navigating to a new page
  useEffect(() => {
    setMessages([]);
    responseIndexRef.current = 0;
  }, [pageTitle]);

  // Seed welcome message when panel opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const ctx = getPageContext();
      const intro = ctx.intro
        ? `I can see this page — "${ctx.intro.slice(0, 80)}${ctx.intro.length > 80 ? '…' : ''}". Ask me anything about it.`
        : `I have full context for this page. What would you like to know?`;
      setMessages([{ role: 'ai', text: intro }]);
    }
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 320);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);

    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      const ctx = getPageContext();
      const idx = responseIndexRef.current % DEMO_RESPONSES.length;
      responseIndexRef.current += 1;
      const responseText = DEMO_RESPONSES[idx](ctx);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    }, delay);
  }, [input, isTyping]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* Scrim */}
      <div
        className={`ai-panel-scrim${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide panel */}
      <aside className={`ai-panel${isOpen ? ' open' : ''}`} aria-label="Ask AI panel">
        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-panel-title">
            <SparkleIcon size={13} />
            Ask AI
          </div>
          {pageTitle && (
            <span className="ai-panel-context">{pageTitle}</span>
          )}
          <button className="ai-panel-close" onClick={onClose} aria-label="Close panel">
            <CloseIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-panel-messages">
          {messages.map((m, i) => (
            <Message key={i} role={m.role} text={m.text} />
          ))}
          {isTyping && <TypingDots />}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="ai-panel-footer">
          <div className="ai-panel-input-wrap">
            <textarea
              ref={inputRef}
              className="ai-panel-input"
              placeholder="Ask anything about this page…"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="ai-panel-send"
              onClick={send}
              disabled={!input.trim() || isTyping}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
          <p className="ai-panel-hint">Press Enter to send · Esc to close</p>
        </div>
      </aside>
    </>
  );
}
