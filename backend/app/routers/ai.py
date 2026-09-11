from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import AiQueryRequest
from ..ai_service import answer_logistics_query, get_grounded_system_context
from ..models import AiQuery

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

@router.post("/ask")
async def ask_ai(req: AiQueryRequest, db: Session = Depends(get_db)):
    """
    Submits a query to the Urban Intelligence Assistant.
    Response is grounded strictly on operational data from the database.
    """
    result = await answer_logistics_query(query=req.query, db=db)

    # Save query record
    query_record = AiQuery(
        query=req.query,
        response=result["response"],
        provider=result["provider"]
    )
    db.add(query_record)
    db.commit()

    return result

@router.get("/context")
def view_grounded_context(db: Session = Depends(get_db)):
    """Allows inspection of the exact structured data feeding the AI layer."""
    return get_grounded_system_context(db)
