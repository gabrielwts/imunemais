from datetime import datetime, timedelta, timezone
import secrets
import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import List
from fastapi import HTTPException, Depends, Query, status, Response, APIRouter
import jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.app import router
import asyncio
from src.database.database import SessionLocal
from src.database.models import UserVaccine, Usuario
from src.schemas.autenticacao_schemas import AutenticacaoLogin, RecuperarSenhaEmailRequest, RecuperarSenhaRequest, Token, TokenComPaciente
from src.schemas.usuario_schemas import ListaUserVacinaResponse, UsuarioSetPassword
from src.auth.crypto import gerar_hash_senha, verificar_senha
from sqlalchemy.exc import IntegrityError
from src.service.autenticacao_service import generate_token
from fastapi import Body, Query

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


# AGORA VEM O CÓDIGO E-MAIL
conf = ConnectionConfig(
    MAIL_USERNAME="suporte.imunemais@gmail.com",
    MAIL_PASSWORD="obuq ovqt pits ejhn",
    MAIL_FROM="suporte.imunemais@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,   
    MAIL_SSL_TLS=False, 
)

# Função gerar código
def gerar_codigo():
    return f"{secrets.randbelow(10000):04d}"


# Função enviar e-mail
# async def enviar_email(destinatario: str, codigo: str):
#     mensagem = MessageSchema(
#         subject="Recuperação de senha",
#         recipients=[destinatario],
#         body=f"Seu código de recuperação é: {codigo}",
#         subtype="plain"
#     )
#     fm = FastMail(conf)
#     await fm.send_message(mensagem)
#     print(f"E-mail enviado para {destinatario} com o código {codigo}")

async def enviar_email(destinatario: str, codigo: str):
    html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f6fa;">
        <div style="max-width: 500px; margin: auto; background: white; border-radius: 8px; padding: 25px; text-align: center; border: 1px solid #e6e6e6;">
            <a style="top: 20px; left: 20px; background-color: #3b82f6; color: white; padding: 10px 20px; border-radius: 5px; font-size: 24px; font-weight: bold; text-decoration: none;">Imune+</a>
            <h2 style="color: #3b82f6;">Recuperação de senha</h2>
            <p style="font-size: 16px; color: #333;">
                Olá! Recebemos uma solicitação para redefinir sua senha.
            </p>
            <p style="font-size: 16px; color: #333;">
                Seu código de recuperação é:
            </p>
            <div style="font-size: 32px; font-weight: bold; color: #3b82f6; margin: 15px 0;">
                {codigo}
            </div>
            <hr style="margin: 25px 0;">
            <p style="font-size: 12px; color: #888;">
                Se você não solicitou essa alteração, por favor ignore este e-mail.
            </p>
        </div>
    </div>
    """

    mensagem = MessageSchema(
        subject="Recuperação de senha - Imune+",
        recipients=[destinatario],
        body=html,
        subtype="html"
    )
    
    fm = FastMail(conf)
    await fm.send_message(mensagem)
    print(f"E-mail enviado para {destinatario} com o código {codigo}")


    
# ROTA RECUPERAR SENHA - COM EMAIL
    
@router.post("/v1/codigo-email-recuperar")
async def recuperar_senha(request: RecuperarSenhaRequest, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.email == request.email).first()
    if not user:
        return {"Status": "O e-mail mencionado é inválido"}

    codigo = gerar_codigo()
    print(f"Código gerado: {codigo}")
    await enviar_email(request.email, codigo)

    return {"status": "Código de recuperação enviado para o e-mail informado.", "codigo": codigo}
    # return {}
    
    
# ROTA RECUPERAR SENHA - COM EMAIL DIFERENTE DA BASE

@router.post("/v1/codigo-diferente-novo-email-recuperar")
async def recuperar_senha_emaildif(request: RecuperarSenhaEmailRequest, db: Session = Depends(get_db)):
    # user = db.query(Usuario).filter(Usuario.email == request.email).first()
    # if not user:
    #     return {"Status": "O e-mail mencionado é inválido"}

    codigo = gerar_codigo()
    print(f"Código gerado: {codigo}")
    await enviar_email(request.email, codigo)

    return {"status": "Código de recuperação enviado para o e-mail informado.", "codigo": codigo}
    
    
# RECUPERAR SENHA - Cadastrar senha usuário
@router.post("/v1/usuarios/recuperar-cadastro-senha")
def criar_senha(cpfSalvo: str, recuperarSenhaCadastro: UsuarioSetPassword, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.cpf == cpfSalvo).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not recuperarSenhaCadastro.password_hash or len(recuperarSenhaCadastro.password_hash) < 6:
        raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres.")

    senha_hash = gerar_hash_senha(recuperarSenhaCadastro.password_hash)
    db_usuario.password_hash = senha_hash

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    return {"status": "Senha alterada com sucesso. Tente realizar o login novamente."}

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