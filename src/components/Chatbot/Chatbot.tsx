import React, { useState, useEffect, useRef } from 'react';
import {
  ChatMessage,
  ChatAction,
  getChatSettings,
  saveChatSettings,
  generateLocalResponse,
  generateGeminiResponse,
  MOHAMMED_CONTEXT
} from '../../services/chatbotService';
import './Chatbot.css';

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

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const [settings, setSettings] = useState(getChatSettings);
  const [tempApiKey, setTempApiKey] = useState(settings.geminiApiKey);

  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `Hi there! 👋 I'm **Mohammed's AI Assistant**.\n\nAsk me anything about Mohammed's full-stack projects, skills, education, or get his contact info and CV!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
          { label: '⚡ Tech Stack', query: 'What are your skills and tech stack?', scrollToId: 'skills' },
          { label: '📄 Download CV', query: 'Can I download your CV?' },
          { label: '📬 Contact Info', query: 'How can I contact Mohammed?', scrollToId: 'contact' }
        ]
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Play subtle UI chime (Web Audio API — zero assets needed)
  const playSound = (type: 'send' | 'receive') => {
    if (!settings.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'send') {
        osc.frequency.setValueAtTime(420, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // AudioContext unavailable or restricted by browser policy
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
      if (window.innerWidth > 768) {
        setTimeout(() => inputRef.current?.focus(), 250);
      }
    }
  }, [isOpen, messages, isTyping]);

  // Hide tooltip after 14 seconds if unopened
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 14000);
    return () => clearTimeout(timer);
  }, []);

  // Handle sending a message
  const handleSend = async (textToSend?: string) => {
    const userQuery = (textToSend || input).trim();
    if (!userQuery || isTyping) return;

    playSound('send');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = Math.floor(Math.random() * 250) + 350;

    try {
      let botResponse: { text: string; actions?: ChatAction[] };

      if (settings.useGemini && settings.geminiApiKey) {
        botResponse = await generateGeminiResponse(userQuery, messages, settings.geminiApiKey);
      } else {
        await new Promise((res) => setTimeout(res, delay));
        botResponse = generateLocalResponse(userQuery);
      }

      playSound('receive');

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: botResponse.actions,
        isGemini: settings.useGemini && !!settings.geminiApiKey
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallback = generateLocalResponse(userQuery);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: fallback.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: fallback.actions
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.scrollToId) {
      const el = document.getElementById(action.scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    } else if (action.query) {
      handleSend(action.query);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat cleared! What would you like to know about Mohammed's work?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '🚀 Top Projects', query: 'What are your top projects?', scrollToId: 'projects' },
          { label: '⚡ Tech Stack', query: 'What are your skills?', scrollToId: 'skills' },
          { label: '📄 Download CV', query: 'Can I download your CV?' }
        ]
      }
    ]);
  };

  const handleCopyTranscript = () => {
    const text = messages
      .map((m) => `${m.sender.toUpperCase()} (${m.timestamp}):\n${m.text}\n`)
      .join('\n---\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTranscript(true);
      setTimeout(() => setCopiedTranscript(false), 2000);
    });
  };

  const handleSaveSettings = () => {
    const updated = saveChatSettings({
      geminiApiKey: tempApiKey.trim(),
      useGemini: settings.useGemini && !!tempApiKey.trim()
    });
    setSettings(updated);
    setShowSettings(false);
  };

  // Helper to render markdown-like formatting (bold, links, code, lists)
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');

    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|`.*?`)/g);

      const formattedLine = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={partIdx} className="chat-inline-code">
              {part.slice(1, -1)}
            </code>
          );
        }

        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [, label, url] = linkMatch;
          return (
            <a key={partIdx} href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          );
        }

        return part;
      });

      return (
        <React.Fragment key={lineIdx}>
          {formattedLine}
          {lineIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="chatbot-wrapper" aria-label="Portfolio Chatbot">
      {/* Launcher Button & Tooltip */}
      <div className="chatbot-launcher-container">
        {showTooltip && !isOpen && (
          <div
            className="chatbot-tooltip-bubble"
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
          >
            <span>Ask Mohammed's Assistant 👋</span>
            <button
              className="tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Dismiss tooltip"
            >
              <i className="bx bx-x"></i>
            </button>
          </div>
        )}

        <button
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
        <div className="chatbot-window" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-profile">
              <div className="chatbot-avatar">
                <i className="bx bx-bot"></i>
                <span className="avatar-online-dot"></span>
              </div>
              <div className="chatbot-header-text">
                <h3>
                  Mohammed AI
                  <span
                    className={`chatbot-mode-badge ${
                      settings.useGemini && settings.geminiApiKey ? 'gemini' : 'local'
                    }`}
                  >
                    {settings.useGemini && settings.geminiApiKey ? '✨ Gemini AI' : '⚡ Instant'}
                  </span>
                </h3>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-header-btn"
                title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
                onClick={() => {
                  const updated = saveChatSettings({ soundEnabled: !settings.soundEnabled });
                  setSettings(updated);
                }}
                aria-label="Toggle Sound"
              >
                <i className={`bx ${settings.soundEnabled ? 'bx-volume-full' : 'bx-volume-mute'}`} />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Copy Transcript"
                onClick={handleCopyTranscript}
                aria-label="Copy Transcript"
              >
                <i className={`bx ${copiedTranscript ? 'bx-check' : 'bx-copy'}`} />
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Settings"
                onClick={() => setShowSettings((prev) => !prev)}
                aria-label="Chatbot Settings"
              >
                <i className="bx bx-cog"></i>
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Clear Chat"
                onClick={handleClearChat}
                aria-label="Clear Chat History"
              >
                <i className="bx bx-trash"></i>
              </button>
              <button
                type="button"
                className="chatbot-header-btn"
                title="Minimize"
                onClick={() => setIsOpen(false)}
                aria-label="Minimize Chat"
              >
                <i className="bx bx-chevron-down"></i>
              </button>
            </div>
          </div>

          {/* Settings Panel Modal */}
          {showSettings && (
            <div className="chatbot-settings-panel">
              <div className="settings-header">
                <h4>
                  <i className="bx bx-slider-alt"></i> Chatbot Settings
                </h4>
                <button
                  type="button"
                  className="chatbot-header-btn"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                >
                  <i className="bx bx-x"></i>
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
                    onClick={() => {
                      const updated = saveChatSettings({ useGemini: false });
                      setSettings(updated);
                    }}
                  >
                    <span>⚡ Instant Portfolio Engine (Offline & Free)</span>
                    {!settings.useGemini && <i className="bx bx-check"></i>}
                  </button>

                  <button
                    type="button"
                    className={`settings-toggle-btn ${settings.useGemini ? 'active' : ''}`}
                    onClick={() => {
                      const updated = saveChatSettings({ useGemini: true });
                      setSettings(updated);
                    }}
                  >
                    <span>✨ Google Gemini AI (Generative)</span>
                    {settings.useGemini && <i className="bx bx-check"></i>}
                  </button>
                </div>

                {settings.useGemini && (
                  <div className="settings-group">
                    <span className="settings-label">Google Gemini API Key</span>
                    <p className="settings-desc">
                      Enter your free Gemini API key to activate generative reasoning. Stored
                      safely in your local browser storage.
                    </p>
                    <input
                      type="password"
                      className="settings-input"
                      placeholder="AIzaSy..."
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
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
                <button
                  type="button"
                  className="settings-btn-save"
                  onClick={handleSaveSettings}
                >
                  Save & Apply
                </button>
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                <div className="chat-bubble">
                  {renderFormattedText(msg.text)}

                  {/* Optional Action Pills underneath response */}
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
                <span className="chat-msg-time">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-msg-row bot">
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
          <div className="chatbot-chips-bar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="chip-btn"
                onClick={() => handleSend(prompt)}
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
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input-field"
              placeholder="Ask me anything about Mohammed..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              maxLength={280}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <i className="bx bx-send"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
