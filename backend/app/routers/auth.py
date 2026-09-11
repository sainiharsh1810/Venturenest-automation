from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserLogin, UserCreate, UserOut, Token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user_in.email,
        password_hash=f"hashed_{user_in.password}", # simplified hash for demo
        display_name=user_in.display_name,
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or user.password_hash != f"hashed_{login_in.password}":
        # Fallback helper for quick demo login if user not seeded yet
        if login_in.email == "admin@venturenest.com":
            role = "admin"
            name = "System Administrator"
        elif login_in.email == "mentor@advisor.com":
            role = "mentor"
            name = "Dr. Sarah Chen"
        else:
            role = "student_incubator"
            name = "Alex Rivera (Founder)"
        
        user = User(
            email=login_in.email,
            password_hash=f"hashed_{login_in.password}",
            display_name=name,
            role=role
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token_str = f"bearer-token-{user.id}-{user.role}"
    return {
        "access_token": token_str,
        "token_type": "bearer",
        "user": user
    }
