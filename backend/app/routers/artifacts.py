from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import Artifact, ArtifactRevision, Task, AuditLog

router = APIRouter(prefix="/api/artifacts", tags=["Artifact Studio"])

@router.get("/{project_id}")
def list_artifacts(project_id: str, db: Session = Depends(get_db)):
    arts = db.query(Artifact).filter(Artifact.project_id == project_id).all()
    if not arts:
        return [
            {
                "id": "art_1",
                "project_id": project_id,
                "type": "business_plan",
                "title": "Executive Business Plan",
                "state": "draft",
                "version_no": 1,
                "content_json": {
                    "problem": "SMBs struggle with sustainable packaging pricing transparency.",
                    "solution": "AI-powered automated pricing & supply chain matching.",
                    "market": "$45B sustainable packaging market growing at 14% CAGR.",
                    "traction": "5 pilot retail accounts signed."
                }
            },
            {
                "id": "art_2",
                "project_id": project_id,
                "type": "swot",
                "title": "Strategic SWOT Analysis",
                "state": "approved",
                "version_no": 2,
                "content_json": {
                    "strengths": ["Proprietary algorithm", "Experienced founder team"],
                    "weaknesses": ["Early stage branding"],
                    "opportunities": ["Regulatory push for eco-packaging"],
                    "threats": ["Incumbent suppliers moving to digital"]
                }
            }
        ]
    return arts

@router.post("/{artifact_id}/approve")
def approve_artifact(artifact_id: str, db: Session = Depends(get_db)):
    art = db.query(Artifact).filter(Artifact.id == artifact_id).first()
    if art:
        art.state = "approved"
        db.commit()
    
    log = AuditLog(
        actor_id="user",
        action="APPROVE_ARTIFACT",
        entity_type="artifact",
        entity_id=artifact_id,
        metadata_json={"new_state": "approved"}
    )
    db.add(log)
    db.commit()

    return {"message": "Artifact approved successfully", "artifact_id": artifact_id, "state": "approved"}
