import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChatMessage,
  ChatAction,
  getChatSettings,
  saveChatSettings,
  generateLocalResponse,
  generateGeminiResponse
} from '../../services/chatbotService';
import './Chatbot.css';

/* -------------------------------------------------------------------------- */
/* Constants & helpers                                                        */
/* -------------------------------------------------------------------------- */

const QUICK_PROMPTS = [
  '🚀 Top Projects',
  '⚡ Tech Stack',
  '📄 Download CV',
  '📬 Contact Info',
  '🎓 Education',
  '💼 Experience',
  '⭐ Why Hire Mohammed?',
  '🇲🇦 Languages'
];

const MAX_INPUT_LENGTH = 280;
const COUNTER_THRESHOLD = 200;

const WELCOME_ACTIONS: ChatAction[] = [
  { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
  { label: '⚡ Tech Stack', query: 'What are your skills and tech stack?', scrollToId: 'skills' },
  { label: '📄 Download CV', query: 'Can I download your CV?' },
  { label: '📬 Contact Info', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
];

const formatTime = (): string =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const createWelcomeMessage = (text: string, id: string): ChatMessage => ({
  id,
  sender: 'bot',
  text,
  timestamp: formatTime(),
  actions: WELCOME_ACTIONS
});

const INITIAL_WELCOME_TEXT =
  "Hi there! 👋 I'm **Mohammed's AI Assistant**.\n\nAsk me anything about Mohammed's full-stack projects, skills, education, or get his contact info and CV!";

/** Only allow safe URL schemes inside rendered links. */
const isSafeUrl = (url: string): boolean => /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(url.trim());

const UL_RE = /^\s*[-•*]\s+(.*)$/;
const OL_RE = /^\s*\d+[.)]\s+(.*)$/;

/** Inline formatting: **bold**, `code`, [label](url) */
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|`.*?`)/g);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;

    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }

    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="chat-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      if (isSafeUrl(url)) {
        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
      return label;
    }

    return part;
  });
};

/** Block formatting: paragraphs, bullet lists, numbered lists, spacing. */
const renderFormattedText = (rawText: string): React.ReactNode[] => {
  const lines = rawText.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (UL_RE.test(line)) {
      const items: string[] = [];
      while (i < lines.length && UL_RE.test(lines[i])) {
        items.push(lines[i].match(UL_RE)![1]);
        i++;
      }
      const start = i;
      blocks.push(
        <ul key={`ul-${start}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ul-${start}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (OL_RE.test(line)) {
      const items: string[] = [];
      while (i < lines.length && OL_RE.test(lines[i])) {
        items.push(lines[i].match(OL_RE)![1]);
        i++;
      }
      const start = i;
      blocks.push(
        <ol key={`ol-${start}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item, `ol-${start}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
    i++;
  }

  return blocks;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const [settings, setSettings] = useState(getChatSettings);
  const [tempApiKey, setTempApiKey] = useState<string>(settings.geminiApiKey);

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(INITIAL_WELCOME_TEXT, 'welcome-1')
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const geminiActive = settings.useGemini && !!settings.geminiApiKey;

  /* ---------------------------- Sound (Web Audio) --------------------------- */

  const playSound = useCallback(
    (type: 'send' | 'receive') => {
      if (!settings.soundEnabled) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') void ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const isSend = type === 'send';
        const duration = isSend ? 0.08 : 0.12;
        const [from, to] = isSend ? [420, 750] : [540, 920];
        const volume = isSend ? 0.03 : 0.035;
        const now = ctx.currentTime;

        osc.frequency.setValueAtTime(from, now);
        osc.frequency.exponentialRampToValueAtTime(to, now + duration);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.start(now);
        osc.stop(now + duration);
      } catch {
        // AudioContext unavailable or restricted by browser policy
      }
    },
    [settings.soundEnabled]
  );

  // Release audio resources on unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => undefined);
      audioCtxRef.current = null;
    };
  }, []);

  /* ------------------------------ Side effects ------------------------------ */

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    setShowTooltip(false);
    if (window.innerWidth > 768 && !showSettings && !isTyping) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen, messages, isTyping, showSettings]);

  // Hide tooltip after 14 seconds if unopened
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 14000);
    return () => clearTimeout(timer);
  }, []);

  // Escape closes settings first, then the chat window
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showSettings) {
        setShowSettings(false);
      } else {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, showSettings]);

  /* -------------------------------- Handlers -------------------------------- */

  const handleSend = async (textToSend?: string) => {
    const userQuery = (textToSend ?? input).trim();
    if (!userQuery || isTyping) return;

    playSound('send');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: formatTime()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = Math.floor(Math.random() * 250) + 350;

    try {
      let botResponse: { text: string; actions?: ChatAction[] };

      if (geminiActive) {
        botResponse = await generateGeminiResponse(userQuery, messages, settings.geminiApiKey);
      } else {
        await new Promise((res) => setTimeout(res, delay));
        botResponse = generateLocalResponse(userQuery);
      }

      playSound('receive');

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse.text,
          timestamp: formatTime(),
          actions: botResponse.actions,
          isGemini: geminiActive
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = generateLocalResponse(userQuery);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: fallback.text,
          timestamp: formatTime(),
          actions: fallback.actions
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.scrollToId) {
      document.getElementById(action.scrollToId)?.scrollIntoView({ behavior: 'smooth' });
    }

    if (action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    } else if (action.query) {
      void handleSend(action.query);
    }
  };

  const handleClearChat = () => {
    setMessages([
      createWelcomeMessage(
        "Chat cleared! What would you like to know about Mohammed's work?",
        `welcome-${Date.now()}`
      )
    ]);
  };

  const handleCopyTranscript = () => {
    const text = messages
      .map((m) => `${m.sender.toUpperCase()} (${m.timestamp}):\n${m.text}\n`)
      .join('\n---\n\n');

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedTranscript(true);
        setTimeout(() => setCopiedTranscript(false), 2000);
      })
      .catch(() => undefined);
  };

  const handleSaveSettings = () => {
    const updated = saveChatSettings({
      geminiApiKey: tempApiKey.trim(),
      useGemini: settings.useGemini && !!tempApiKey.trim()
    });
    setSettings(updated);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setTempApiKey(settings.geminiApiKey);
    setShowSettings((prev) => !prev);
  };

  /* --------------------------------- Render --------------------------------- */

  return (
    <div className="chatbot-wrapper">
      {/* Launcher Button & Tooltip */}
      <div className="chatbot-launcher-container">
        {showTooltip && !isOpen && (
          <div
            className="chatbot-tooltip-bubble"
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span>Ask Mohammed's Assistant 👋</span>
            <button
              type="button"
              className="tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Dismiss tooltip"
            >
              <i className="bx bx-x" />
            </button>
          </div>
        )}

        <button
          ref={launcherRef}
          type="button"
          className="chatbot-launcher-btn"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close assistant' : 'Open Mohammed AI assistant'}
        >
          <span className="chatbot-status-indicator" />
          <i className={`bx ${isOpen ? 'bx-x' : 'bx-bot'}`} />
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className="chatbot-window"
          role="dialog"
          aria-modal="false"
          aria-label="Mohammed AI assistant"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-profile">
              <div className="chatbot-avatar">
                <i className="bx bx-bot" />
                <span className="avatar-online-dot" />
              </div>
              <div className="chatbot-header-text">
                <h3>
                  Mohammed AI
                  <span className={`chatbot-mode-badge ${geminiActive ? 'gemini' : 'local'}`}>
                    {geminiActive ? '✨ Gemini AI' : '⚡ Instant'}
                  </span>
                </h3>
                <p className="chatbot-header-sub">
                  {isTyping ? 'Typing…' : 'Online · Typically replies instantly'}
                </p>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-header-btn"
                title={settings.soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
                onClick={() => setSettings(saveChatSettings({ soundEnabled: !settings.soundEnabled }))}
                aria-label={settings.soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
                aria-pressed={settings.soundEnabled}
              >
                <i className={`bx ${settings.soundEnabled ? 'bx-volume-full' : 'bx-volume-mute'}`} />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title={copiedTranscript ? 'Copied!' : 'Copy transcript'}
                onClick={handleCopyTranscript}
                aria-label="Copy transcript"
              >
                <i className={`bx ${copiedTranscript ? 'bx-check' : 'bx-copy'}`} />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Settings"
                onClick={toggleSettings}
                aria-label="Chatbot settings"
                aria-expanded={showSettings}
              >
                <i className="bx bx-cog" />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Clear chat"
                onClick={handleClearChat}
                aria-label="Clear chat history"
              >
                <i className="bx bx-trash" />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Minimize"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
              >
                <i className="bx bx-chevron-down" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="chatbot-settings-panel">
              <div className="settings-header">
                <h4>
                  <i className="bx bx-slider-alt" /> Chatbot Settings
                </h4>
                <button
                  type="button"
                  className="chatbot-header-btn"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                >
                  <i className="bx bx-x" />
                </button>
              </div>

              <div className="settings-body">
                <div className="settings-group">
                  <span className="settings-label">Operating Mode</span>
                  <p className="settings-desc">
                    Choose between the ultra-fast built-in knowledge base (zero latency, offline) or
                    live Google Gemini AI generative answers.
                  </p>

                  <button
                    type="button"
                    className={`settings-toggle-btn ${!settings.useGemini ? 'active' : ''}`}
                    aria-pressed={!settings.useGemini}
                    onClick={() => setSettings(saveChatSettings({ useGemini: false }))}
                  >
                    <span>⚡ Instant Portfolio Engine (Offline & Free)</span>
                    {!settings.useGemini && <i className="bx bx-check" />}
                  </button>

                  <button
                    type="button"
                    className={`settings-toggle-btn ${settings.useGemini ? 'active' : ''}`}
                    aria-pressed={settings.useGemini}
                    onClick={() => setSettings(saveChatSettings({ useGemini: true }))}
                  >
                    <span>✨ Google Gemini AI (Generative)</span>
                    {settings.useGemini && <i className="bx bx-check" />}
                  </button>
                </div>

                {settings.useGemini && (
                  <div className="settings-group">
                    <label className="settings-label" htmlFor="chatbot-gemini-key">
                      Google Gemini API Key
                    </label>
                    <p className="settings-desc">
                      Enter your free Gemini API key to activate generative reasoning. Stored safely
                      in your local browser storage.
                    </p>
                    <input
                      id="chatbot-gemini-key"
                      type="password"
                      className="settings-input"
                      placeholder="AIzaSy..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="settings-link"
                    >
                      Get a free Gemini API key at Google AI Studio →
                    </a>
                  </div>
                )}
              </div>

              <div className="settings-footer">
                <button type="button" className="settings-btn-save" onClick={handleSaveSettings}>
                  Save & Apply
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                <div className="chat-bubble">
                  {renderFormattedText(msg.text)}

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="chat-actions-container">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="chat-action-btn"
                          onClick={() => handleActionClick(action)}
                        >
                          {action.icon && <i className={`bx ${action.icon}`} />}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="chat-msg-meta">
                  {msg.sender === 'bot' && msg.isGemini && (
                    <span className="chat-msg-ai-tag">✨ AI</span>
                  )}
                  <span className="chat-msg-time">{msg.timestamp}</span>
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg-row bot" aria-label="Assistant is typing">
                <div className="chat-bubble">
                  <div className="chat-typing-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="chatbot-chips-bar" role="toolbar" aria-label="Suggested questions">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chip-btn"
                onClick={() => void handleSend(prompt)}
                disabled={isTyping}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            className="chatbot-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
          >
            <div className="chatbot-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input-field"
                placeholder="Ask me anything about Mohammed..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                maxLength={MAX_INPUT_LENGTH}
                aria-label="Type your message"
                autoComplete="off"
              />
              {input.length >= COUNTER_THRESHOLD && (
                <span
                  className={`chat-input-counter ${
                    input.length >= MAX_INPUT_LENGTH ? 'limit' : ''
                  }`}
                >
                  {input.length}/{MAX_INPUT_LENGTH}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <i className="bx bx-send" />
            </button>
          </form>

          <div className="chatbot-footer-note">
            {geminiActive
              ? 'Answers generated by Google Gemini · may contain errors'
              : "Instant answers from Mohammed's portfolio data"}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;