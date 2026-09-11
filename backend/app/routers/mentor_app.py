from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import MentorshipRequest, SubmittedDocument, MentorReview, Project, User
from app.schemas import MentorReviewCreate

router = APIRouter(prefix="/api/mentor-app", tags=["Mentors App"])

@router.get("/assigned-projects")
def list_assigned_incubatees(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    result = []
    for p in (projects or []):
        docs = db.query(SubmittedDocument).filter(SubmittedDocument.project_id == p.id).all()
        result.append({
            "project_id": p.id,
            "project_name": p.name,
            "stage": p.stage,
            "context": p.context_json,
            "documents_count": len(docs),
            "latest_document": docs[0].title if docs else "No documents uploaded"
        })
    if not result:
        return [
            {
                "project_id": "p1",
                "project_name": "EcoPack AI",
                "stage": "seed",
                "context": {"problem": "Sustainable packaging pricing for e-commerce SMBs."},
                "documents_count": 1,
                "latest_document": "EcoPack_PitchDeck_v1.pdf"
            },
            {
                "project_id": "p2",
                "project_name": "MedFlow Tech",
                "stage": "pre-seed",
                "context": {"problem": "Automating clinic scheduling & triage."},
                "documents_count": 2,
                "latest_document": "MedFlow_BusinessPlan_v2.pdf"
            }
        ]
    return result

@router.get("/help-requests")
def list_help_requests(db: Session = Depends(get_db)):
    requests = db.query(MentorshipRequest).all()
    if not requests:
        return [
            {
                "id": "m1",
                "project_id": "p1",
                "project_name": "EcoPack AI",
                "student_name": "Alex Rivera",
                "title": "Financial Model & CAC Assumptions Review",
                "category": "finance",
                "description": "We need help reviewing our customer acquisition cost (CAC) assumptions and 12-month runway projection before our incubator demo day.",
                "status": "open"
            }
        ]
    
    output = []
    for r in requests:
        proj = db.query(Project).filter(Project.id == r.project_id).first()
        output.append({
            "id": r.id,
            "project_id": r.project_id,
            "project_name": proj.name if proj else "Startup Venture",
            "student_name": "Alex Rivera",
            "title": r.title,
            "category": r.category,
            "description": r.description,
            "status": r.status
        })
    return output

@router.post("/reviews")
def submit_mentor_review(payload: MentorReviewCreate, db: Session = Depends(get_db)):
    review = MentorReview(
        mentorship_request_id=payload.mentorship_request_id,
        document_id=payload.document_id,
        mentor_id="u3", # default mentor user
        feedback_text=payload.feedback_text,
        rating=payload.rating or 5,
        status_tag=payload.status_tag or "approved"
    )
    db.add(review)

    # Update request status to resolved
    req = db.query(MentorshipRequest).filter(MentorshipRequest.id == payload.mentorship_request_id).first()
    if req:
        req.status = "resolved"

    db.commit()
    db.refresh(review)
    return {"message": "Mentor review submitted successfully", "review_id": review.id}
