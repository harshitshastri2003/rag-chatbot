def retrieve(query: str, collection, model):
    query_embedding = model.encode([query]).tolist()
    
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )
    
    chunks = results["documents"][0]
    context = "\n\n".join(chunks)
    return context