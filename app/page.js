"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   JAPANESE GRAMMAR BUDDY — Main UI
   A companion app for Japanese language learners (Duolingo pair)
   ═══════════════════════════════════════════════════════════════ */

// ─── Styles ────────────────────────────────────────────────────
const COLORS = {
  bg: "#0F1923",
  surface: "#1A2733",
  surfaceHover: "#223344",
  border: "#2A3A4A",
  borderLight: "#3A4A5A",
  accent: "#C41E3A",       // Hinomaru red
  accentHover: "#D42E4A",
  accentSoft: "rgba(196, 30, 58, 0.15)",
  gold: "#D4A574",         // Warm amber
  goldSoft: "rgba(212, 165, 116, 0.15)",
  text: "#E8E6E3",
  textMuted: "#8B9DAF",
  textDim: "#5A6A7A",
  white: "#FFFFFF",
  success: "#4CAF50",
  error: "#E57373",
};

function getStyles() {
  return `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-dm-sans), 'Noto Sans JP', sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.text};
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderLight}; }

    /* ── Layout ── */
    .app-header {
      padding: 20px 24px 16px;
      border-bottom: 1px solid ${COLORS.border};
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .app-title {
      font-family: var(--font-fraunces), serif;
      font-size: 22px;
      font-weight: 600;
      color: ${COLORS.text};
      letter-spacing: -0.3px;
    }
    .app-title span { color: ${COLORS.accent}; }
    .header-actions { display: flex; gap: 8px; align-items: center; }

    .main-layout {
      display: flex;
      height: calc(100vh - 73px);
    }

    /* ── Left Column ── */
    .left-col {
      width: 380px;
      min-width: 380px;
      border-right: 1px solid ${COLORS.border};
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .left-content { padding: 20px; flex: 1; }

    /* ── Right Column (Chat) ── */
    .right-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .chat-header {
      padding: 16px 20px;
      border-bottom: 1px solid ${COLORS.border};
      font-family: var(--font-fraunces), serif;
      font-size: 16px;
      font-weight: 500;
      color: ${COLORS.textMuted};
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .chat-input-area {
      padding: 16px 20px;
      border-top: 1px solid ${COLORS.border};
      display: flex;
      gap: 10px;
    }
    .chat-input {
      flex: 1;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 10px;
      padding: 12px 16px;
      color: ${COLORS.text};
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }
    .chat-input:focus { border-color: ${COLORS.accent}; }
    .chat-input::placeholder { color: ${COLORS.textDim}; }

    /* ── Message Bubbles ── */
    .msg { max-width: 85%; line-height: 1.6; font-size: 14px; }
    .msg-user {
      align-self: flex-end;
      background: ${COLORS.accentSoft};
      border: 1px solid rgba(196, 30, 58, 0.25);
      padding: 10px 16px;
      border-radius: 16px 16px 4px 16px;
      color: ${COLORS.text};
    }
    .msg-assistant {
      align-self: flex-start;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 10px 16px;
      border-radius: 16px 16px 16px 4px;
      color: ${COLORS.text};
    }
    .msg-assistant p { margin-bottom: 8px; }
    .msg-assistant p:last-child { margin-bottom: 0; }
    .msg-assistant code {
      background: rgba(255,255,255,0.06);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 13px;
    }

    /* ── Inputs & Buttons ── */
    .input-group { margin-bottom: 16px; }
    .input-label {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: ${COLORS.textMuted};
      margin-bottom: 8px;
      font-weight: 500;
    }
    .text-input {
      width: 100%;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 10px;
      padding: 14px 16px;
      color: ${COLORS.text};
      font-size: 16px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }
    .text-input:focus { border-color: ${COLORS.accent}; }
    .text-input::placeholder { color: ${COLORS.textDim}; }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary {
      background: ${COLORS.accent};
      color: ${COLORS.white};
    }
    .btn-primary:hover:not(:disabled) { background: ${COLORS.accentHover}; }
    .btn-ghost {
      background: transparent;
      color: ${COLORS.textMuted};
      padding: 8px 12px;
    }
    .btn-ghost:hover:not(:disabled) { background: ${COLORS.surface}; color: ${COLORS.text}; }
    .btn-surface {
      background: ${COLORS.surface};
      color: ${COLORS.textMuted};
      border: 1px solid ${COLORS.border};
    }
    .btn-surface:hover:not(:disabled) {
      background: ${COLORS.surfaceHover};
      color: ${COLORS.text};
      border-color: ${COLORS.borderLight};
    }
    .btn-small { padding: 6px 12px; font-size: 12px; }
    .btn-icon {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: 8px;
    }

    .btn-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

    /* ── Translation Display ── */
    .translation-card {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .translation-japanese {
      font-size: 22px;
      line-height: 1.6;
      margin-bottom: 10px;
      color: ${COLORS.text};
    }
    .translation-english {
      font-size: 15px;
      color: ${COLORS.gold};
      line-height: 1.5;
    }
    .translation-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid ${COLORS.border};
    }

    /* ── Word Breakdown ── */
    .breakdown-toggle {
      width: 100%;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 14px 16px;
      color: ${COLORS.textMuted};
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 500;
    }
    .breakdown-toggle:hover {
      background: ${COLORS.surfaceHover};
      color: ${COLORS.text};
      border-color: ${COLORS.borderLight};
    }
    .breakdown-panel {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      animation: slideDown 0.2s ease;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .word-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .word-chip {
      background: ${COLORS.bg};
      border: 1px solid ${COLORS.border};
      border-radius: 10px;
      padding: 10px 14px;
      text-align: center;
      min-width: 70px;
      transition: all 0.2s;
    }
    .word-chip:hover {
      border-color: ${COLORS.accent};
      background: ${COLORS.accentSoft};
    }
    .word-japanese {
      font-size: 20px;
      line-height: 1.4;
      margin-bottom: 4px;
    }
    .word-japanese ruby { font-size: 20px; }
    .word-japanese rt {
      font-size: 10px;
      color: ${COLORS.accent};
      font-weight: 400;
    }
    .word-english {
      font-size: 11px;
      color: ${COLORS.gold};
      margin-bottom: 2px;
    }
    .word-pos {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: ${COLORS.textDim};
      font-weight: 600;
    }

    /* ── Saved Phrases Panel ── */
    .saved-panel {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      margin-bottom: 16px;
      animation: slideDown 0.2s ease;
      overflow: hidden;
    }
    .saved-panel-header {
      padding: 14px 16px;
      border-bottom: 1px solid ${COLORS.border};
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: ${COLORS.textMuted};
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .saved-list {
      max-height: 400px;
      overflow-y: auto;
    }
    .saved-item {
      padding: 12px 16px;
      border-bottom: 1px solid ${COLORS.border};
      cursor: pointer;
      transition: background 0.15s;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .saved-item:last-child { border-bottom: none; }
    .saved-item:hover { background: ${COLORS.surfaceHover}; }
    .saved-item-text {
      flex: 1;
      min-width: 0;
    }
    .saved-item-jp {
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }
    .saved-item-en {
      font-size: 12px;
      color: ${COLORS.textMuted};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .saved-item-delete {
      background: none;
      border: none;
      color: ${COLORS.textDim};
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 16px;
      line-height: 1;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .saved-item-delete:hover { color: ${COLORS.error}; background: rgba(229,115,115,0.1); }

    /* ── Screenshot Upload ── */
    .screenshot-zone {
      border: 2px dashed ${COLORS.border};
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 16px;
    }
    .screenshot-zone:hover {
      border-color: ${COLORS.accent};
      background: ${COLORS.accentSoft};
    }
    .screenshot-zone-text {
      color: ${COLORS.textMuted};
      font-size: 13px;
    }
    .screenshot-phrases {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .screenshot-phrase-btn {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      padding: 10px 12px;
      color: ${COLORS.text};
      font-size: 15px;
      cursor: pointer;
      border-radius: 8px;
      transition: background 0.15s;
      font-family: inherit;
    }
    .screenshot-phrase-btn:hover { background: ${COLORS.surfaceHover}; }

    /* ── Login ── */
    .login-overlay {
      position: fixed;
      inset: 0;
      background: ${COLORS.bg};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .login-card {
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 16px;
      padding: 40px;
      width: 360px;
      max-width: 90vw;
    }
    .login-title {
      font-family: var(--font-fraunces), serif;
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
      text-align: center;
    }
    .login-title span { color: ${COLORS.accent}; }
    .login-subtitle {
      text-align: center;
      color: ${COLORS.textMuted};
      font-size: 14px;
      margin-bottom: 28px;
    }
    .login-error {
      background: rgba(229,115,115,0.1);
      border: 1px solid rgba(229,115,115,0.3);
      color: ${COLORS.error};
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      margin-bottom: 16px;
      text-align: center;
    }
    .login-divider {
      text-align: center;
      color: ${COLORS.textDim};
      font-size: 12px;
      margin: 20px 0;
      position: relative;
    }
    .login-divider::before, .login-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 20px);
      height: 1px;
      background: ${COLORS.border};
    }
    .login-divider::before { left: 0; }
    .login-divider::after { right: 0; }

    /* ── Loading ── */
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid ${COLORS.border};
      border-top-color: ${COLORS.accent};
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .loading-dots::after {
      content: '';
      animation: dots 1.4s steps(4) infinite;
    }
    @keyframes dots {
      0% { content: ''; }
      25% { content: '.'; }
      50% { content: '..'; }
      75% { content: '...'; }
    }

    /* ── Toast ── */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      border-radius: 10px;
      padding: 12px 20px;
      font-size: 13px;
      color: ${COLORS.text};
      z-index: 9999;
      animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    @keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }

    /* ── Empty States ── */
    .empty-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${COLORS.textDim};
      text-align: center;
      padding: 40px;
      gap: 12px;
    }
    .empty-chat-icon { font-size: 40px; opacity: 0.5; }
    .empty-chat-text { font-size: 14px; line-height: 1.6; }

    /* ── User Badge ── */
    .user-badge {
      font-size: 12px;
      color: ${COLORS.textMuted};
      background: ${COLORS.surface};
      border: 1px solid ${COLORS.border};
      padding: 5px 12px;
      border-radius: 20px;
    }

    /* ── Mobile ── */
    @media (max-width: 768px) {
      .main-layout { flex-direction: column; height: auto; min-height: calc(100vh - 73px); }
      .left-col { width: 100%; min-width: 100%; border-right: none; border-bottom: 1px solid ${COLORS.border}; overflow-y: visible; }
      .right-col { min-height: 500px; }
      .app-title { font-size: 18px; }
      .translation-japanese { font-size: 19px; }
    }
  `;
}

// ─── Icons (inline SVG) ────────────────────────────────────────
const Icon = {
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Bookmark: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  BookmarkFilled: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Camera: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  LogOut: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

// ─── Helpers ───────────────────────────────────────────────────
function formatChatMessage(text) {
  if (!text) return "";
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Paragraphs
  html = html
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return html;
}

// ─── App ───────────────────────────────────────────────────────
export default function Home() {
  // Auth state
  const [user, setUser] = useState(null); // null = loading, string = username
  const [authChecked, setAuthChecked] = useState(false);

  // Input state
  const [inputText, setInputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Translation state
  const [currentPhrase, setCurrentPhrase] = useState(null); // { japanese, english }

  // Breakdown state
  const [breakdown, setBreakdown] = useState(null); // [{ japanese, reading, english, pos }]
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]); // [{ role, content }]
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);

  // Saved phrases
  const [savedPhrases, setSavedPhrases] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Screenshot
  const [screenshotPhrases, setScreenshotPhrases] = useState(null);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Toast
  const [toast, setToast] = useState(null);

  // Refs
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  // ── Show toast ──
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Auth check on mount — auto-login ──
  useEffect(() => {
    fetch("/api/login")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || "default");
        setAuthChecked(true);
      })
      .catch(() => {
        setUser("default");
        setAuthChecked(true);
      });
  }, []);

  // ── Load saved phrases when user is set ──
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  // ── Auto-scroll chat ──
  useEffect(() => {
    if (shouldAutoScroll.current && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading]);

  // ── Reset ──
  function resetState() {
    setCurrentPhrase(null);
    setBreakdown(null);
    setShowBreakdown(false);
    setChatMessages([]);
    setChatInput("");
    setInputText("");
    setScreenshotPhrases(null);
  }

  // ── Translate ──
  async function handleTranslate(text = null) {
    const phrase = (text || inputText).trim();
    if (!phrase) return;

    resetState();
    setInputText(phrase);
    setIsTranslating(true);
    setBreakdownLoading(true);
    shouldAutoScroll.current = true;

    // Fetch translation and breakdown in parallel
    const [transRes, breakRes] = await Promise.all([
      fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase }),
      }).then((r) => r.json()),
      fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: phrase }),
      }).then((r) => r.json()),
    ]);

    setIsTranslating(false);
    setBreakdownLoading(false);

    if (transRes.translation) {
      setCurrentPhrase({ japanese: phrase, english: transRes.translation });
    }
    if (breakRes.words) {
      setBreakdown(breakRes.words);
    }
  }

  // ── Pronunciation ──
  async function handleSpeak() {
    if (!currentPhrase || isPlaying) return;
    setIsPlaying(true);
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentPhrase.japanese }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  }

  // ── Chat ──
  async function handleChat(e) {
    e.preventDefault();
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;

    shouldAutoScroll.current = true;
    const newMessages = [...chatMessages, { role: "user", content: msg }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: currentPhrase?.japanese || "",
          translation: currentPhrase?.english || "",
          messages: newMessages,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages([...newMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    }
    setChatLoading(false);
  }

  // ── History ──
  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.phrases) {
        setSavedPhrases(data.phrases);
      }
    } catch {}
    setHistoryLoading(false);
  }

  async function savePhrase() {
    if (!currentPhrase) return;
    const entry = {
      id: Date.now().toString(),
      japanese: currentPhrase.japanese,
      english: currentPhrase.english,
      breakdown: breakdown,
      chat: chatMessages,
      savedAt: new Date().toISOString(),
    };
    const updated = [entry, ...savedPhrases];
    setSavedPhrases(updated);
    showToast("Phrase saved");

    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phrases: updated }),
    });
  }

  async function deletePhrase(id) {
    const updated = savedPhrases.filter((p) => p.id !== id);
    setSavedPhrases(updated);

    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phrases: updated }),
    });
    showToast("Phrase deleted");
  }

  function loadSavedPhrase(phrase) {
    shouldAutoScroll.current = false;
    setInputText(phrase.japanese);
    setCurrentPhrase({ japanese: phrase.japanese, english: phrase.english });
    setBreakdown(phrase.breakdown || null);
    setChatMessages(phrase.chat || []);
    setShowBreakdown(false);
    setShowSaved(false);
    setScreenshotPhrases(null);
  }

  // ── Screenshot ──
  async function handleScreenshot(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setScreenshotLoading(true);
    setScreenshotPhrases(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result.split(",")[1];
        const res = await fetch("/api/parse-screenshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType: file.type }),
        });
        const data = await res.json();
        if (data.phrases?.length) {
          setScreenshotPhrases(data.phrases);
        } else {
          showToast("No Japanese phrases found");
        }
      } catch {
        showToast("Failed to parse screenshot");
      }
      setScreenshotLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function selectScreenshotPhrase(phrase) {
    setScreenshotPhrases(null);
    setInputText(phrase);
    handleTranslate(phrase);
  }

  // ── Check if current phrase is saved ──
  const isSaved =
    currentPhrase &&
    savedPhrases.some((p) => p.japanese === currentPhrase.japanese);

  // ── Toggle panels (mutually exclusive) ──
  function toggleBreakdown() {
    if (showBreakdown) {
      setShowBreakdown(false);
    } else {
      setShowBreakdown(true);
      setShowSaved(false);
    }
  }

  function toggleSaved() {
    if (showSaved) {
      setShowSaved(false);
    } else {
      setShowSaved(true);
      setShowBreakdown(false);
    }
  }

  // ── Render ──
  if (!authChecked) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: getStyles() }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: getStyles() }} />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-title">
          Japanese <span>文法</span> Buddy
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="main-layout">
        {/* ── Left Column ── */}
        <div className="left-col">
          <div className="left-content">
            {/* Input */}
            <div className="input-group">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="input-label" style={{ margin: 0 }}>Japanese phrase</label>
                <button
                  className="btn btn-surface btn-small"
                  onClick={toggleSaved}
                >
                  Saved ({savedPhrases.length})
                </button>
              </div>
              <textarea
                className="text-input"
                rows={2}
                placeholder="Type or paste Japanese text..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
              />
            </div>

            <div className="btn-row">
              <button
                className="btn btn-primary"
                onClick={() => handleTranslate()}
                disabled={!inputText.trim() || isTranslating}
                style={{ flex: 1 }}
              >
                {isTranslating ? (
                  <>
                    <span className="spinner" /> Translating
                  </>
                ) : (
                  "Translate"
                )}
              </button>
              <button
                className="btn btn-surface btn-icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={screenshotLoading}
                title="Upload Duolingo screenshot"
              >
                {screenshotLoading ? <span className="spinner" /> : <Icon.Camera />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleScreenshot}
              />
            </div>

            {/* Screenshot phrases */}
            {screenshotPhrases && (
              <div className="screenshot-phrases" style={{ marginTop: 16 }}>
                <div className="input-label" style={{ marginBottom: 8, padding: "0 4px" }}>
                  Select a phrase
                </div>
                {screenshotPhrases.map((p, i) => (
                  <button
                    key={i}
                    className="screenshot-phrase-btn"
                    onClick={() => selectScreenshotPhrase(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Saved phrases panel */}
            {showSaved && (
              <div className="saved-panel" style={{ marginTop: 16 }}>
                <div className="saved-panel-header">
                  <span>Saved Phrases ({savedPhrases.length})</span>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setShowSaved(false)}
                    style={{ width: 28, height: 28 }}
                  >
                    <Icon.X />
                  </button>
                </div>
                <div className="saved-list">
                  {historyLoading ? (
                    <div style={{ padding: 20, textAlign: "center" }}>
                      <span className="spinner" />
                    </div>
                  ) : savedPhrases.length === 0 ? (
                    <div
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: COLORS.textDim,
                        fontSize: 13,
                      }}
                    >
                      No saved phrases yet
                    </div>
                  ) : (
                    savedPhrases.map((p) => (
                      <div
                        key={p.id}
                        className="saved-item"
                        onClick={() => loadSavedPhrase(p)}
                      >
                        <div className="saved-item-text">
                          <div className="saved-item-jp">{p.japanese}</div>
                          <div className="saved-item-en">{p.english}</div>
                        </div>
                        <button
                          className="saved-item-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhrase(p.id);
                          }}
                          title="Delete"
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Translation card */}
            {currentPhrase && (
              <div className="translation-card" style={{ marginTop: 16 }}>
                <div className="translation-japanese">{currentPhrase.japanese}</div>
                <div className="translation-english">{currentPhrase.english}</div>
                <div className="translation-actions">
                  <button
                    className="btn btn-surface btn-small"
                    onClick={handleSpeak}
                    disabled={isPlaying}
                  >
                    <Icon.Play /> {isPlaying ? "Playing..." : "Listen"}
                  </button>
                  <button
                      className="btn btn-surface btn-small"
                      onClick={savePhrase}
                      disabled={isSaved}
                    >
                      {isSaved ? (
                        <>
                          <Icon.BookmarkFilled /> Saved
                        </>
                      ) : (
                        <>
                          <Icon.Bookmark /> Save
                        </>
                      )}
                    </button>
                </div>
              </div>
            )}

            {/* Word breakdown */}
            {currentPhrase && breakdown && (
              <>
                <button className="breakdown-toggle" onClick={toggleBreakdown}>
                  <span>Word Breakdown ({breakdown.length} elements)</span>
                  {showBreakdown ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
                </button>

                {showBreakdown && (
                  <div className="breakdown-panel">
                    <div className="word-grid">
                      {breakdown.map((w, i) => (
                        <div key={i} className="word-chip">
                          <div
                            className="word-japanese"
                            dangerouslySetInnerHTML={{
                              __html: w.reading && w.reading !== w.japanese
                                ? `<ruby>${w.japanese}<rt>${w.reading}</rt></ruby>`
                                : w.japanese,
                            }}
                          />
                          <div className="word-english">{w.english}</div>
                          <div className="word-pos">{w.pos}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {breakdownLoading && !breakdown && (
              <div
                style={{
                  textAlign: "center",
                  padding: 20,
                  color: COLORS.textDim,
                  fontSize: 13,
                }}
              >
                <span className="spinner" style={{ marginRight: 8 }} />
                Analyzing word structure...
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (Chat) ── */}
        <div className="right-col">
          <div className="chat-header">Grammar Chat</div>

          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.length === 0 && !chatLoading ? (
              <div className="empty-chat">
                <div className="empty-chat-icon">💬</div>
                <div className="empty-chat-text">
                  {currentPhrase
                    ? "Ask a question about this phrase — grammar, usage, nuance, anything!"
                    : "Translate a phrase first, then ask grammar questions here."}
                </div>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`msg ${msg.role === "user" ? "msg-user" : "msg-assistant"}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      msg.role === "assistant"
                        ? formatChatMessage(msg.content)
                        : msg.content,
                  }}
                />
              ))
            )}
            {chatLoading && (
              <div className="msg msg-assistant">
                <span className="loading-dots">Thinking</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleChat}>
            <textarea
              className="chat-input"
              rows={1}
              placeholder={
                currentPhrase
                  ? "Ask about grammar, meaning, usage..."
                  : "Translate a phrase first..."
              }
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!currentPhrase}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleChat(e);
                }
              }}
            />
            <button
              className="btn btn-primary btn-icon"
              type="submit"
              disabled={!chatInput.trim() || chatLoading || !currentPhrase}
            >
              <Icon.Send />
            </button>
          </form>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
