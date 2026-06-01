from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.Client()

def get_collection():
    try:
        client.delete_collection("rag_collection")
    except:
        pass
    return client.create_collection("rag_collection")

def ingest_pdf(file_path: str):
    collection = get_collection()
    
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    chunks = [text[i:i+500] for i in range(0, len(text), 500)]
    embeddings = model.encode(chunks).tolist()

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[str(i) for i in range(len(chunks))]
    )
    return {"status": f"{len(chunks)} chunks stored!"}