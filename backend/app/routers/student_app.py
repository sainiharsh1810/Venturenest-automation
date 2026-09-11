from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Project, SubmittedDocument, Task, MentorshipRequest, User
from app.schemas import ProjectCreate, ProjectOut, DocumentSubmit, DocumentOut, MentorshipRequestCreate

router = APIRouter(prefix="/api/student-app", tags=["Student/Incubator App"])

@router.get("/projects", response_model=List[ProjectOut])
def get_student_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    if not projects:
        return [
            Project(
                id="p1",
                name="EcoPack AI",
                stage="seed",
                status="active",
                context_json={"problem": "SMB packaging costs", "target": "E-commerce retailers"}
            )
        ]
    return projects

@router.post("/projects", response_model=ProjectOut)
def create_student_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(
        name=payload.name,
        stage=payload.stage or "idea",
        context_json=payload.context_json or {}
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/documents", response_model=List[DocumentOut])
def list_student_documents(db: Session = Depends(get_db)):
    docs = db.query(SubmittedDocument).all()
    if not docs:
        return [
            SubmittedDocument(
                id="d1",
                project_id="p1",
                uploader_id="u2",
                title="EcoPack_PitchDeck_v1.pdf",
                file_type="pdf",
                file_url="https://storage.venturenest.com/docs/EcoPack_PitchDeck_v1.pdf",
                file_size_bytes=2450000,
                tags=["pitch_deck", "v1"],
                notes="Initial pitch deck submission"
            )
        ]
    return docs

@router.post("/documents", response_model=DocumentOut)
def submit_document(payload: DocumentSubmit, db: Session = Depends(get_db)):
    doc = SubmittedDocument(
        project_id=payload.project_id,
        uploader_id="u2", # default student user
        title=payload.title,
        file_type=payload.file_type,
        file_url=payload.file_url,
        file_size_bytes=payload.file_size_bytes or 102400,
        tags=payload.tags or ["general"],
        notes=payload.notes
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.post("/request-mentor")
def create_mentorship_request(payload: MentorshipRequestCreate, db: Session = Depends(get_db)):
    req = MentorshipRequest(
        project_id=payload.project_id,
        student_id="u2",
        title=payload.title,
        category=payload.category or "general",
        description=payload.description,
        status="open"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return {"message": "Mentorship request submitted successfully", "request_id": req.id}
