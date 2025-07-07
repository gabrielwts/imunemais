from fastapi import APIRouter, HTTPException, Depends, Query, status, Response
from src.database import models
from src.app import router
from src.database.database import SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.database.models import UserVaccine, Usuario, RegisteredProfessional
from src.schemas.autenticacao_schemas import AdmAutenticacaoLogin, Token, AdmComToken
from src.schemas.funcionario_schemas import ProfissionalBase, FuncionarioCreateResponse
from src.schemas.usuario_schemas import ListaUserDados, ListaUserVacinaResponse, PacienteCompleto
from src.auth.crypto import gerar_hash_senha, verificar_senha
from src.service.adm_autenticacao_service import generate_token

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

ADMIN_USER = "00000000000"
ADMIN_SENHA = "admingps123"

@router.post("/v1/adm/cadastro")
def criar_usuario(adm_usuario: ProfissionalBase, db: Session = Depends(get_db)) -> FuncionarioCreateResponse:
    db_usuario = RegisteredProfessional(
        nome_pro=adm_usuario.nome_pro,
        usuario=adm_usuario.usuario,
        cargo_prof=adm_usuario.cargo_prof,
    )

    if not adm_usuario.password_prof or len(adm_usuario.password_prof) < 6:
        raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres.")

    senha_hash = gerar_hash_senha(adm_usuario.password_prof)
    db_usuario.password_prof = senha_hash

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    return FuncionarioCreateResponse(id=db_usuario.id)

@router.post("/v1/adm/autenticacao", response_model=AdmComToken)
def login_adm(form: AdmAutenticacaoLogin, db: Session = Depends(get_db)):
    adm_usuario = db.query(RegisteredProfessional).filter(RegisteredProfessional.usuario == form.usuario).first()
    if not adm_usuario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos",
        )
    if not verificar_senha(senha_plana=form.senha, senha_hash=adm_usuario.password_prof):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login ou senha inválidos",
        )
    access_token, access_token_expires = generate_token(adm_usuario)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": {
            "id": adm_usuario.id,
            "nome": adm_usuario.nome_pro,
            "usuario": adm_usuario.usuario,
            "profissional": adm_usuario.cargo_prof
        }
    }

@router.get("/v1/paciente/{cpf}", response_model=PacienteCompleto)
def consultar_paciente(cpf: str, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.cpf == cpf).first()
    if not user:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")

    vacinas = db.query(UserVaccine).filter(UserVaccine.numero_cpf == cpf).all()

    return PacienteCompleto(
        dados_pessoais=ListaUserDados(
            cpf=user.cpf,
            nome_completo=user.nome_completo,
            data_nascimento=user.data_nascimento,
            telefone=user.telefone,
            email=user.email
        ),
        vacinas=[
            ListaUserVacinaResponse(
                nome_vacina=v.nome_vacina,
                tipo_dose=v.tipo_dose,
                descricao_vacina=v.descricao_vacina,
                numero_cpf=v.numero_cpf,
                validacao=v.validacao
            ) for v in vacinas
        ]
    )

@router.get("/v1/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

@router.get("/v1/vacinas")
def listar_vacinas(db: Session = Depends(get_db)):
    return db.query(models.Vacina).all()

@router.get("/v1/vacinas/nome")
def buscar_vacina_nome(busca: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.Vacina).filter(models.Vacina.nome.ilike(f"%{busca}%")).all()

@router.get("/v1/vacinas/faixa-etaria")
def buscar_vacina_faixa(faixa: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.Vacina).filter(models.Vacina.faixa_etaria == faixa).all()

@router.put("/v1/paciente/{cpf}")
def atualizar_paciente(cpf: str, nome: str, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter_by(cpf=cpf).first()
    if not user:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    user.nome = nome
    db.commit()
    return {"mensagem": "Paciente atualizado"}

class ValidarVacinaSchema(BaseModel):
    realizada: bool

@router.put("/v1/vacina/{id}/validar")
def validar_vacina(id: int, dados: ValidarVacinaSchema, db: Session = Depends(get_db)):
    vacina = db.query(models.Vacina).filter_by(id=id).first()
    if not vacina:
        raise HTTPException(status_code=404, detail="Vacina não encontrada")
    vacina.status = "REALIZADA" if dados.realizada else "PENDENTE"
    db.commit()
    return {"mensagem": f"Vacina marcada como {'REALIZADA' if dados.realizada else 'PENDENTE'}"}
