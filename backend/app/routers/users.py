from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models import User

router = APIRouter(prefix="/api/users", tags=["Users & Accounts"])

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

@router.get("", response_model=List[UserOut])
def get_all_users(role: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

@router.get("/summary")
def get_user_summary(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {
        "total_users": len(users),
        "admins": len([u for u in users if u.role == "admin"]),
        "delivery_agents": len([u for u in users if u.role == "driver"]),
        "businesses": len([u for u in users if u.role == "business"]),
        "customers": len([u for u in users if u.role == "customer"]),
    }

@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
    return user
