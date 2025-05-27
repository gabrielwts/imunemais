from src.database.database import SessionLocal
from fastapi import APIRouter, HTTPException, Depends
from src.schemas.usuario_schemas import UsuarioCreate, UsuarioCreateResponse
from src.database.models import Usuario
from sqlalchemy.orm import Session
from src.app import router

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/v1/usuarios")
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
    db_usuario = Usuario(
        nome_completo=usuario.nome_completo,
        cpf=usuario.cpf,
        data_nascimento=usuario.data_nascimento,
        telefone=usuario.telefone,
        email=usuario.email,
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return UsuarioCreateResponse(id=db_usuario.id)