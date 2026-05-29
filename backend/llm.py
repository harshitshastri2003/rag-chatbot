from groq import Groq
import os

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_answer(question: str, context: str):
    prompt = f"Use the following context to answer the question.\n\nContext:\n{context}\n\nQuestion: {question}"
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content