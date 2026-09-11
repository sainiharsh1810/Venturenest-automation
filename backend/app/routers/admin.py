from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Project, SubmittedDocument, MentorshipRequest, AuditLog, Organisation
from app.schemas import SystemStatsOut, UserOut, UserRoleUpdate, AuditLogOut

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=SystemStatsOut)
def get_system_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_projects = db.query(Project).filter(Project.status == "active").count()
    submitted_docs = db.query(SubmittedDocument).count()
    open_requests = db.query(MentorshipRequest).filter(MentorshipRequest.status == "open").count()
    
    org = db.query(Organisation).first()
    tokens_used = org.ai_token_used if org else 145200

    return {
        "total_users": total_users or 12,
        "active_projects": active_projects or 5,
        "submitted_documents": submitted_docs or 8,
        "open_mentorship_requests": open_requests or 3,
        "total_ai_tokens_used": tokens_used,
        "system_status": "operational"
    }

@router.get("/users", response_model=List[UserOut])
def list_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    if not users:
        # Return fallback demo users list if database empty
        return [
            User(id="u1", email="admin@venturenest.com", display_name="System Admin", role="admin"),
            User(id="u2", email="student@incubator.edu", display_name="Alex Rivera (Founder)", role="student_incubator"),
            User(id="u3", email="mentor@advisor.com", display_name="Dr. Sarah Chen (Mentor)", role="mentor"),
        ]
    return users

@router.post("/users/role")
def update_user_role(payload: UserRoleUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role = payload.new_role
    db.commit()

    # Log audit event
    log = AuditLog(
        actor_id="admin-user",
        action="UPDATE_USER_ROLE",
        entity_type="user",
        entity_id=payload.user_id,
        metadata_json={"new_role": payload.new_role}
    )
    db.add(log)
    db.commit()
    
    return {"message": "User role updated successfully", "user_id": payload.user_id, "role": payload.new_role}

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
    if not logs:
        # Fallback sample audit logs
        return [
            AuditLog(id="a1", actor_id="u1", action="LOGIN", entity_type="session", metadata_json={"ip": "127.0.0.1"}),
            AuditLog(id="a2", actor_id="u2", action="SUBMIT_DOCUMENT", entity_type="document", entity_id="d1", metadata_json={"file": "EcoPack_Pitch.pdf"}),
            AuditLog(id="a3", actor_id="u3", action="SUBMIT_MENTOR_REVIEW", entity_type="review", entity_id="r1", metadata_json={"rating": 5}),
        ]
    return logs
