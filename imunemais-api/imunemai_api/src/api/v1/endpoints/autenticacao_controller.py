from datetime import datetime, timedelta, timezone
import os
from typing import List
from fastapi import HTTPException, Depends, Query, status, Response
import jwt
from sqlalchemy.orm import Session
from src.app import router
from src.database.database import SessionLocal
from src.database.models import UserVaccine, Usuario
from src.schemas.autenticacao_schemas import AutenticacaoLogin, Token, TokenComUsuario
from src.schemas.usuario_schemas import ListaUserVacinaResponse
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
    
@router.get("/v1/paciente/vacinas", response_model=list[ListaUserVacinaResponse])
def listar_vacinas(cpf: str, db: Session = Depends(get_db)):
    print("Recebido CPF:", cpf)
    vacinas = db.query(UserVaccine).filter(UserVaccine.numero_cpf == cpf).all()

    if not vacinas:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou sem vacinas")

    return [
        ListaUserVacinaResponse(
            nome_vacina=v.nome_vacina,
            tipo_dose=v.tipo_dose,
            descricao_vacina=v.descricao_vacina,
            numero_cpf=v.numero_cpf,
            validacao=v.validacao
        )
        for v in vacinas
    ]