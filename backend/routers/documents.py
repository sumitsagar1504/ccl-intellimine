from fastapi import APIRouter, Depends
from routers.auth import get_current_user, TokenData

router = APIRouter()

@router.get("/")
def get_documents(current_user: TokenData = Depends(get_current_user)):
    return {"message": "Document list — connect to DB + ChromaDB"}

@router.post("/search")
def search_documents(body: dict, current_user: TokenData = Depends(get_current_user)):
    """RAG document search using ChromaDB + Gemini."""
    query = body.get("query", "")
    # TODO: 1) Embed query with sentence-transformers
    # TODO: 2) Vector search in ChromaDB
    # TODO: 3) Pass retrieved chunks to Gemini with question
    return {"query": query, "answer": "Connect ChromaDB for real RAG search", "sources": []}

@router.post("/upload")
def upload_document(current_user: TokenData = Depends(get_current_user)):
    """Upload document to MinIO + index in ChromaDB."""
    return {"message": "Document uploaded and indexed"}
