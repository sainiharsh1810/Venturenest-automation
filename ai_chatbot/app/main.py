from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.orchestrator import AIOrchestrator
from app.chatbot import ChatbotHandler

app = FastAPI(
    title="VentureNest AI Service",
    version="1.0.0",
    description="AI Generation Orchestrator & Conversational Assistant Microservice."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    kind: str # business_plan, swot, mentor_summary
    context: Dict[str, Any]

class ChatRequest(BaseModel):
    user_role: str # student_incubator, mentor
    query: str
    context: Optional[Dict[str, Any]] = {}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "VentureNest AI Microservice"}

@app.post("/ai/generate")
def generate_artifact(req: GenerateRequest):
    if req.kind == "swot":
        result = AIOrchestrator.generate_swot_analysis(req.context)
    elif req.kind == "mentor_summary":
        result = AIOrchestrator.summarize_document_for_mentor(
            req.context.get("title", "Submitted Document"),
            req.context.get("notes", "")
        )
    else:
        result = AIOrchestrator.generate_business_plan(req.context)
    
    return {"status": "succeeded", "result": result}

@app.post("/ai/chat")
def chat_assistant(req: ChatRequest):
    res = ChatbotHandler.answer_query(req.user_role, req.query, req.context)
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
