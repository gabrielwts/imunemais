from datetime import datetime, timedelta, timezone
import os
from typing import List
from fastapi import HTTPException, Depends, status, Response
import jwt
from sqlalchemy.orm import Session
from src.app import router
from src.database.database import SessionLocal
from src.database.models import Usuario
from src.schemas.usuario_schemas import UsuarioCreate, UsuarioBase, UsuarioCreateResponse
from src.schemas.autenticacao_schemas import AutenticacaoLogin, Token
from sqlalchemy.exc import IntegrityError
from src.service.autenticacao_service import generate_token
from src.auth.crypto import verificar_senha

AUTENTICACAO_LOGIN = "/v1/autenticacao"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/v1/autenticacao", response_model=Token)
def login_usuario(form: AutenticacaoLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.cpf == form.cpf).first()
    if not usuario or not verificar_senha(form.senha, usuario.password_hash):
        raise HTTPException(status_code=400, detail="CPF ou senha inválidos")

    access_token = generate_token(usuario)  # você pode adaptar aqui
    return Token(access_token=access_token, token_type="bearer")
