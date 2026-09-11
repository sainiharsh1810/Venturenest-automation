import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Boolean, JSON, BigInteger
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    avatar_url = Column(Text, nullable=True)
    role = Column(String, nullable=False, default="student_incubator") # admin, student_incubator, mentor
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Organisation(Base):
    __tablename__ = "organisations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    plan = Column(String, default="incubator_starter")
    ai_token_quota = Column(Integer, default=500000)
    ai_token_used = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    organisation_id = Column(String, ForeignKey("organisations.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    stage = Column(String, default="idea")
    status = Column(String, default="active")
    owner_id = Column(String, ForeignKey("users.id"))
    context_json = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    type = Column(String, nullable=False) # business_plan, swot, brand_kit, financial
    title = Column(String, nullable=False)
    current_revision_id = Column(String, nullable=True)
    state = Column(String, default="draft") # draft, in_review, approved, archived
    created_at = Column(DateTime, default=datetime.utcnow)

class ArtifactRevision(Base):
    __tablename__ = "artifact_revisions"

    id = Column(String, primary_key=True, default=generate_uuid)
    artifact_id = Column(String, ForeignKey("artifacts.id", ondelete="CASCADE"))
    version_no = Column(Integer, nullable=False)
    content_json = Column(JSON, nullable=False, default={})
    content_text = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"))
    approved_at = Column(DateTime, nullable=True)
    approved_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="todo") # backlog, todo, in_progress, blocked, done
    priority = Column(String, default="medium") # low, medium, high, urgent
    owner_id = Column(String, ForeignKey("users.id"))
    due_at = Column(DateTime, nullable=True)
    linked_artifact_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    organisation_id = Column(String, nullable=True)
    actor_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    metadata_json = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

class SubmittedDocument(Base):
    __tablename__ = "submitted_documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    uploader_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_url = Column(Text, nullable=False)
    file_size_bytes = Column(BigInteger, default=0)
    tags = Column(JSON, default=[])
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MentorshipRequest(Base):
    __tablename__ = "mentorship_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"))
    student_id = Column(String, ForeignKey("users.id"))
    mentor_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    category = Column(String, default="general")
    description = Column(Text, nullable=False)
    status = Column(String, default="open") # open, in_discussion, resolved, closed
    created_at = Column(DateTime, default=datetime.utcnow)

class MentorReview(Base):
    __tablename__ = "mentor_reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    mentorship_request_id = Column(String, ForeignKey("mentorship_requests.id", ondelete="CASCADE"))
    document_id = Column(String, nullable=True)
    mentor_id = Column(String, ForeignKey("users.id"))
    feedback_text = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    status_tag = Column(String, default="approved")
    created_at = Column(DateTime, default=datetime.utcnow)
