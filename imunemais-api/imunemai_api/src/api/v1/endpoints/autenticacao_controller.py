from datetime import datetime, timedelta, timezone
import os
from typing import List
from fastapi import HTTPException, Depends, Query, status, Response
import jwt
from sqlalchemy.orm import Session
from src.app import router
from src.database.database import SessionLocal
from src.database.models import UserVaccine, Usuario
from src.schemas.autenticacao_schemas import AutenticacaoLogin, Token, TokenComPaciente
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

@router.post("/v1/autenticacao", response_model=TokenComPaciente)
def login_usuario(form: AutenticacaoLogin, db: Session = Depends(get_db)):

    usuario = db.query(Usuario).filter(Usuario.cpf == form.cpf).first()

    if not usuario:
        print("Usuário não encontrado no banco.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos"
        )

    print(f"Usuário encontrado: {usuario.nome_completo}")
    print(f"Hash armazenado: {usuario.password_hash}")

    if not verificar_senha(senha_plana=form.senha, senha_hash=usuario.password_hash):
        print("Senha inválida (não bate com o hash).")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos"
        )

    print("Senha válida. Gerando token...")
    access_token, access_token_expires = generate_token(usuario)

    print("Token gerado com sucesso!")
    print("---- FIM LOGIN ----\n")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "paciente": {
            "id": usuario.id,
            "nome": usuario.nome_completo,
            "telefone": usuario.telefone,
            "email": usuario.email,
            "cpf": usuario.cpf,
            "data_nascimento": usuario.data_nascimento,
            "imagem_perfil": usuario.imagem_perfil
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

# Rotas testes

@router.post("/v1/teste-senha")
def teste_senha(cpf: str, senha: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.cpf == cpf).first()
    if not user:
        return {"status": "CPF não encontrado"}
    ok = verificar_senha(senha, user.password_hash)
    return {"senha_valida": ok}

@router.post("v1/teste-senha")
def teste_senha(cpf: str, senha: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.cpf == cpf).first()
    if not user:
        return {"status": "CPF não encontrado"}
    ok = verificar_senha(senha, user.password_hash)
    return {"senha_valida": ok}
