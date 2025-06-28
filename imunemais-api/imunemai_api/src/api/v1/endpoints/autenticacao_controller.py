from datetime import datetime, timedelta, timezone
import os
from typing import List
from fastapi import HTTPException, Depends, status, Response
import jwt
from sqlalchemy.orm import Session
from src.app import router
from src.database.database import SessionLocal
from src.database.models import Usuario
from src.schemas.autenticacao_schemas import AutenticacaoLogin, Token, TokenComUsuario
from src.auth.crypto import gerar_hash_senha, verificar_senha
from sqlalchemy.exc import IntegrityError
from src.service.autenticacao_service import generate_token

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/v1/autenticacao", response_model=TokenComUsuario)
def login_usuario(form: AutenticacaoLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.cpf == form.cpf).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos",
        )
    if not verificar_senha(senha_plana=form.senha, senha_hash=usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos",
        )
    access_token, access_token_expires = generate_token(usuario)
    # return Token(access_token=access_token, token_type="bearer")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome_completo,
            "telefone": usuario.telefone,
            "email": usuario.email,
            "cpf": usuario.cpf,
            "data_nascimento": usuario.data_nascimento
        }
    }