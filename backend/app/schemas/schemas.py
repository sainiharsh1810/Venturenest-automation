from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth & User Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    display_name: str
    role: str = "student_incubator" # admin, student_incubator, mentor

class UserOut(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

# Project Schemas
class ProjectCreate(BaseModel):
    name: str
    stage: Optional[str] = "idea"
    context_json: Optional[Dict[str, Any]] = {}

class ProjectOut(BaseModel):
    id: str
    organisation_id: Optional[str] = None
    name: str
    stage: str
    status: str
    owner_id: Optional[str] = None
    context_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Document Submission Schemas (Student App)
class DocumentSubmit(BaseModel):
    project_id: str
    title: str
    file_type: str
    file_url: str
    file_size_bytes: Optional[int] = 0
    tags: Optional[List[str]] = []
    notes: Optional[str] = None

class DocumentOut(BaseModel):
    id: str
    project_id: str
    uploader_id: str
    title: str
    file_type: str
    file_url: str
    file_size_bytes: int
    tags: List[str]
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Mentorship Request Schemas (Mentors App)
class MentorshipRequestCreate(BaseModel):
    project_id: str
    title: str
    category: Optional[str] = "general"
    description: str

class MentorReviewCreate(BaseModel):
    mentorship_request_id: str
    document_id: Optional[str] = None
    feedback_text: str
    rating: Optional[int] = 5
    status_tag: Optional[str] = "approved"

# Admin Schemas (Admin Dashboard)
class SystemStatsOut(BaseModel):
    total_users: int
    active_projects: int
    submitted_documents: int
    open_mentorship_requests: int
    total_ai_tokens_used: int
    system_status: str = "operational"

class UserRoleUpdate(BaseModel):
    user_id: str
    new_role: str

class AuditLogOut(BaseModel):
    id: str
    actor_id: Optional[str]
    action: str
    entity_type: str
    entity_id: Optional[str]
    metadata_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
