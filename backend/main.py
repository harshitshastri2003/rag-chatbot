from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from ingest import ingest_pdf, collection, model
from retriever import retrieve
from llm import get_answer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://rag-chatbot-ten-lilac.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "RAG Bot is alive!"}

@app.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    save_path = f"temp_{file.filename}"
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    result = ingest_pdf(save_path)
    os.remove(save_path)
    return result

@app.post("/chat")
def chat(question: str):
    try:
        context = retrieve(question, collection, model)
        answer = get_answer(question, context)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}