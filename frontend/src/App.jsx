import { useState } from "react"

const BACKEND = "https://rag-chatbot-production-1d7b.up.railway.app"

export default function App() {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const uploadPDF = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    await fetch(`${BACKEND}/upload`, {
      method: "POST",
      body: formData,
    })
    setUploading(false)
    setMessages([{ role: "system", text: `"${file.name}" uploaded successfully` }])
  }

  const askQuestion = async () => {
    if (!question.trim()) return
    setMessages((prev) => [...prev, { role: "user", text: question }])
    setLoading(true)
    setQuestion("")
    const res = await fetch(`${BACKEND}/chat?question=${encodeURIComponent(question)}`, {
      method: "POST",
    })
    const data = await res.json()
    setMessages((prev) => [...prev, { role: "bot", text: data.answer }])
    setLoading(false)
  }

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.h1}>RAG Chatbot</h1>
        <p style={styles.subtitle}>Upload a PDF and ask questions about it</p>
      </div>

      <label style={styles.uploadBtn}>
        {uploading ? "Uploading..." : "📁 Upload PDF"}
        <input type="file" accept=".pdf" style={{ display: "none" }} onChange={uploadPDF} />
      </label>

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>💬 Upload a PDF to get started</div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            ...styles.msg,
            ...(m.role === "user" ? styles.userMsg :
              m.role === "bot" ? styles.botMsg : styles.systemMsg),
          }}>
            {m.text}
          </div>
        ))}
        {loading && <ThinkingBubble />}
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Ask a question about your PDF..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
        />
        <button style={styles.sendBtn} onClick={askQuestion}>Send</button>
      </div>

      <style>{animations}</style>
    </div>
  )
}

function ThinkingBubble() {
  return (
    <div style={styles.thinkingBox}>
      <svg width="88" height="56" viewBox="0 0 88 56" xmlns="http://www.w3.org/2000/svg">
        <g className="s-body">
          <g className="s-head">
            <circle cx="22" cy="8" r="6" fill="none" stroke="#a5b4fc" strokeWidth="1.5" />
            <circle cx="20" cy="7" r="1" fill="#a5b4fc" />
            <circle cx="24" cy="7" r="1" fill="#a5b4fc" />
            <path d="M19.5 10 Q22 12.5 24.5 10" fill="none" stroke="#a5b4fc" strokeWidth="1" strokeLinecap="round" />
          </g>
          <line x1="22" y1="14" x2="22" y2="34" stroke="#a5b4fc" strokeWidth="1.5" />
          <g className="s-armR">
            <line x1="22" y1="21" x2="36" y2="28" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
            <g className="fR1" style={{ transformOrigin: "36px 26px" }}>
              <rect x="33" y="23" width="5" height="4" rx="1" fill="#818cf8" />
            </g>
            <g className="fR2" style={{ transformOrigin: "36px 26px" }}>
              <circle cx="36" cy="22" r="2.5" fill="#6ee7b7" />
            </g>
          </g>
          <g className="s-armL">
            <line x1="22" y1="21" x2="8" y2="28" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
            <g className="fL1" style={{ transformOrigin: "8px 26px" }}>
              <rect x="5" y="23" width="5" height="4" rx="1" fill="#fbbf24" />
            </g>
            <g className="fL2" style={{ transformOrigin: "8px 26px" }}>
              <circle cx="8" cy="22" r="2.5" fill="#f87171" />
            </g>
          </g>
          <g className="s-legR">
            <line x1="22" y1="34" x2="30" y2="50" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          <g className="s-legL">
            <line x1="22" y1="34" x2="14" y2="50" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>
        <rect x="56" y="30" width="18" height="14" rx="2" fill="none" stroke="#4b5563" strokeWidth="1.2" />
        <rect x="54" y="26" width="7" height="5" rx="1" fill="none" stroke="#4b5563" strokeWidth="1" />
        <line x1="56" y1="35" x2="74" y2="35" stroke="#4b5563" strokeWidth="0.8" />
      </svg>
      <span style={{ fontSize: "12px", color: "#9ca3af" }}>Searching your document...</span>
    </div>
  )
}

const animations = `
  @keyframes bodyBob {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-2px); }
  }
  @keyframes headNod {
    0%,100% { transform: rotate(0deg); }
    40%     { transform: rotate(-10deg); }
  }
  @keyframes throwR {
    0%   { transform: rotate(-10deg); }
    25%  { transform: rotate(-52deg); }
    55%  { transform: rotate(38deg); }
    100% { transform: rotate(-10deg); }
  }
  @keyframes throwL {
    0%   { transform: rotate(10deg); }
    25%  { transform: rotate(52deg); }
    55%  { transform: rotate(-38deg); }
    100% { transform: rotate(10deg); }
  }
  @keyframes legR {
    0%,100% { transform: rotate(-5deg); }
    50%     { transform: rotate(5deg); }
  }
  @keyframes legL {
    0%,100% { transform: rotate(5deg); }
    50%     { transform: rotate(-5deg); }
  }
  @keyframes flyR {
    0%   { transform: translate(0,0) rotate(0deg); opacity:1; }
    100% { transform: translate(26px,-18px) rotate(210deg); opacity:0; }
  }
  @keyframes flyL {
    0%   { transform: translate(0,0) rotate(0deg); opacity:1; }
    100% { transform: translate(-26px,-18px) rotate(-210deg); opacity:0; }
  }
  .s-body { animation: bodyBob 0.65s ease-in-out infinite; }
  .s-head { animation: headNod 0.65s ease-in-out infinite; transform-origin: 22px 8px; }
  .s-armR { animation: throwR 0.6s ease-in-out infinite; transform-origin: 22px 21px; }
  .s-armL { animation: throwL 0.6s ease-in-out 0.3s infinite; transform-origin: 22px 21px; }
  .s-legR { animation: legR 0.6s ease-in-out infinite; transform-origin: 22px 34px; }
  .s-legL { animation: legL 0.6s ease-in-out infinite; transform-origin: 22px 34px; }
  .fR1 { animation: flyR 0.6s ease-out infinite; }
  .fR2 { animation: flyR 0.6s ease-out 0.2s infinite; }
  .fL1 { animation: flyL 0.6s ease-out 0.3s infinite; }
  .fL2 { animation: flyL 0.6s ease-out 0.5s infinite; }
`

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0f0f1a",
    backgroundImage: `
      radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 10%, rgba(251,146,60,0.08) 0%, transparent 40%)
    `,
    display: "flex", flexDirection: "column",
    alignItems: "center", padding: "2rem 1rem",
  },
  header: { textAlign: "center", marginBottom: "2rem" },
  h1: {
    fontSize: "30px", fontWeight: 500, letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #a5b4fc 0%, #6ee7b7 100%)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitle: { fontSize: "14px", color: "#9ca3af", marginTop: "5px" },
  uploadBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
    border: "0.5px solid rgba(99,102,241,0.4)", borderRadius: "10px",
    padding: "10px 22px", fontSize: "14px", fontWeight: 500,
    cursor: "pointer", marginBottom: "1.5rem",
  },
  chatBox: {
    width: "100%", maxWidth: "660px",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "16px", minHeight: "300px", maxHeight: "400px",
    overflowY: "auto", padding: "1rem",
    display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1rem",
  },
  emptyState: {
    flex: 1, display: "flex", alignItems: "center",
    justifyContent: "center", color: "#4b5563", fontSize: "13px",
  },
  msg: { maxWidth: "75%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px", lineHeight: 1.6 },
  userMsg: { alignSelf: "flex-end", background: "rgba(99,102,241,0.25)", color: "#c7d2fe", border: "0.5px solid rgba(99,102,241,0.3)" },
  botMsg: { alignSelf: "flex-start", background: "rgba(255,255,255,0.07)", color: "#e5e7eb", border: "0.5px solid rgba(255,255,255,0.1)" },
  systemMsg: { alignSelf: "center", background: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "0.5px solid rgba(16,185,129,0.3)", fontSize: "13px", padding: "6px 14px" },
  thinkingBox: {
    alignSelf: "flex-start", background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px",
  },
  inputRow: { width: "100%", maxWidth: "660px", display: "flex", gap: "8px" },
  input: {
    flex: 1, background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: "10px",
    padding: "10px 14px", fontSize: "14px", color: "#e5e7eb", outline: "none",
  },
  sendBtn: {
    background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "white",
    border: "none", borderRadius: "10px", padding: "10px 20px",
    fontSize: "14px", fontWeight: 500, cursor: "pointer",
  },
}