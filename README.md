# 📄 RAG Chatbot

A full-stack Retrieval-Augmented Generation (RAG) chatbot that lets you upload any PDF and ask questions about it using AI.

🔗 **Live Demo:** https://rag-chatbot-ten-lilac.vercel.app

---

## 🧠 How It Works

```
PDF Upload → Extract Text → Split into Chunks → Convert to Vectors → Store in ChromaDB
                                                                              ↓
User Question → Convert to Vector → Find Similar Chunks → Send to LLM → Answer
```

---

## 🏗️ Architecture

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind |
| Backend | FastAPI (Python) |
| Embeddings | Sentence Transformers (all-MiniLM-L6-v2) |
| Vector Database | ChromaDB |
| LLM | Llama 3.3 70B via Groq API |
| Deployment | Railway (backend) + Vercel (frontend) |

---

## ✨ Features

- Upload any PDF document
- Ask questions in natural language
- Answers grounded in your document (no hallucination)
- Animated stickman while searching
- Modern dark UI

---

## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
rag-chatbot/
├── backend/
│   ├── main.py        # FastAPI endpoints
│   ├── ingest.py      # PDF → chunks → vectors
│   ├── retriever.py   # Query ChromaDB
│   ├── llm.py         # Groq LLM integration
│   └── requirements.txt
├── frontend/
│   └── src/
│       └── App.jsx    # React UI
└── README.md
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |

---

## 👨‍💻 Built By

**Harshit Shastri** — Final Year AI/ML Student  
[GitHub](https://github.com/harshitshastri2003) • [LinkedIn](https://linkedin.com/in/your-linkedin)