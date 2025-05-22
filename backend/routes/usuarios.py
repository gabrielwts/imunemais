from fastapi import APIRouter, HTTPException, Depends
from backend import schemas
from backend import models
from backend.database import SessionLocal
from sqlalchemy.orm import Session

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def criar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = models.Usuario(**usuario.dict())
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return db_usuario