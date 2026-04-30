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
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

function NewChatIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function getPageContext() {
  const headings = [...document.querySelectorAll('.page h2, .page h3')]
    .map(h => h.textContent.trim()).filter(Boolean).slice(0, 6);
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
  () => `That's a great question. In a production integration you'd connect this panel to your AI endpoint and pass it the page markdown as context. The "Copy for LLM" button copies exactly the right format.`,
  () => `This is a prototype panel — wire up a real endpoint (OpenAI, Claude, Gemini) in \`AskAIPanel.jsx\` to get live answers. The page text is already extracted and ready to use as the system prompt.`,
  () => `For OEM integrations, the recommended pattern is to use the page content as a retrieval chunk in a RAG pipeline so responses stay accurate to the SDK version being documented.`,
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="ai-msg ai-msg--ai ai-msg--typing" aria-label="AI is thinking">
      <span className="ai-msg-avatar"><SparkleIcon size={11} /></span>
      <span className="ai-msg-dots"><span /><span /><span /></span>
    </div>
  );
}

function Message({ role, text }) {
  return (
    <div className={`ai-msg ai-msg--${role}`}>
      {role === 'ai' && (
        <span className="ai-msg-avatar"><SparkleIcon size={11} /></span>
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

  // Push/pull the whole layout by toggling a class on <html>
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      html.classList.add('ai-panel-open');
    } else {
      html.classList.remove('ai-panel-open');
    }
    return () => html.classList.remove('ai-panel-open');
  }, [isOpen]);

  // Reset conversation when page changes
  useEffect(() => {
    setMessages([]);
    responseIndexRef.current = 0;
  }, [pageTitle]);

  // Seed welcome message when panel opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const ctx = getPageContext();
      const intro = ctx.intro
        ? `I can see this page — "${ctx.intro.slice(0, 90)}${ctx.intro.length > 90 ? '…' : ''}". Ask me anything about it.`
        : `I have full context for this page. What would you like to know?`;
      setMessages([{ role: 'ai', text: intro }]);
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
    responseIndexRef.current = 0;
    // Re-seed
    setTimeout(() => {
      const ctx = getPageContext();
      const intro = ctx.intro
        ? `I can see this page — "${ctx.intro.slice(0, 90)}${ctx.intro.length > 90 ? '…' : ''}". Ask me anything about it.`
        : `I have full context for this page. What would you like to know?`;
      setMessages([{ role: 'ai', text: intro }]);
    }, 50);
  }, []);

  const send = useCallback(() => {
    if (!input.trim() || isTyping) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsTyping(true);
    const delay = 800 + Math.random() * 500;
    setTimeout(() => {
      const ctx = getPageContext();
      const idx = responseIndexRef.current % DEMO_RESPONSES.length;
      responseIndexRef.current += 1;
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', text: DEMO_RESPONSES[idx](ctx) }]);
    }, delay);
  }, [input, isTyping]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <aside className={`ai-panel${isOpen ? ' open' : ''}`} aria-label="Ask AI">

      {/* ── Header ── */}
      <div className="ai-panel-header">
        <div className="ai-panel-header-top">
          <div className="ai-panel-title">
            <SparkleIcon size={13} /> Ask AI
          </div>
          <div className="ai-panel-header-actions">
            <button className="ai-panel-icon-btn" onClick={startNewChat} title="New chat">
              <NewChatIcon />
            </button>
            <button className="ai-panel-icon-btn" onClick={onClose} title="Close" aria-label="Close AI panel">
              <CloseIcon />
            </button>
          </div>
        </div>
        <p className="ai-panel-disclaimer">
          Responses are generated using AI and may contain mistakes.
        </p>
      </div>

      {/* ── Source chip ── */}
      {pageTitle && (
        <div className="ai-panel-source">
          <span className="ai-panel-source-chip">
            <SparkleIcon size={10} /> UX Library · {pageTitle}
          </span>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="ai-panel-messages">
        {messages.map((m, i) => <Message key={i} role={m.role} text={m.text} />)}
        {isTyping && <TypingDots />}
        <div ref={endRef} />
      </div>

      {/* ── Input ── */}
      <div className="ai-panel-footer">
        <div className="ai-panel-input-wrap">
          <textarea
            ref={inputRef}
            className="ai-panel-input"
            placeholder="Ask a question about this page…"
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
        <p className="ai-panel-hint">Enter to send · Esc to close</p>
      </div>
    </aside>
  );
}
