from typing import List
from fastapi import APIRouter, HTTPException, Depends, Query, status, Response
from src.database import models
from src.app import router
from src.database.database import SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from src.database.models import CartilhaVacina, UserVaccine, Usuario, RegisteredProfessional
from src.schemas.autenticacao_schemas import AdmAutenticacaoLogin, Token, AdmComToken
from src.schemas.funcionario_schemas import ProfissionalBase, FuncionarioCreateResponse
from src.schemas.usuario_schemas import AtualizarDadosPaciente, AtualizarStatusVacinas, ListaTodasVacinasCadastradas, ListaTodosPacientesCadastrados, ListaUserDados, ListaUserVacinaResponse, PacienteCompleto

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
            detail="Login inválido",
        )
    if not verificar_senha(senha_plana=form.senha, senha_hash=adm_usuario.password_prof):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha inválida",
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

# Consultar paciente por CPF
@router.get("/v1/interno/paciente/dados", response_model=PacienteCompleto)
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
            email=user.email,
            imagem_perfil=user.imagem_perfil
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
    
# Atualizar dados do paciente na tela de consultar pacientes
@router.put("/v1/interno/paciente/atualizardados")
def atualizar_dados(atualizar: AtualizarDadosPaciente, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(cpf=atualizar.cpf_original).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    cpf_antigo = usuario.cpf

    if atualizar.cpf_novo is not None:
        usuario.cpf = atualizar.cpf_novo

    if atualizar.nome_completo is not None:
        usuario.nome_completo = atualizar.nome_completo

    if atualizar.data_nascimento is not None:
        usuario.data_nascimento = atualizar.data_nascimento

    if atualizar.telefone is not None:
        usuario.telefone = atualizar.telefone

    if atualizar.email is not None:
        usuario.email = atualizar.email

    vacinas_do_usuario = db.query(UserVaccine).filter(UserVaccine.numero_cpf == cpf_antigo).all()

    if atualizar.nome_completo is not None:
        vacinas_do_usuario = db.query(UserVaccine).filter(
            UserVaccine.numero_cpf == usuario.cpf  # já atualizado!
        ).all()

    for vacina in vacinas_do_usuario:
        vacina.full_name = atualizar.nome_completo

    db.commit()
    db.refresh(usuario)

    return {"mensagem": "Dados atualizados com sucesso"}


# Listar todos os usuários
@router.get("/v1/interno/lista/pacientes/cadastrados", response_model=List[ListaTodosPacientesCadastrados])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario.nome_completo, Usuario.cpf).all()

# Listar todas as vacinas
@router.get("/v1/interno/lista/vacinas/cadastradas", response_model=List[ListaTodasVacinasCadastradas])
def listar_vacinas(db: Session = Depends(get_db)):
    return db.query(CartilhaVacina.vacinas_nome, CartilhaVacina.descricao, CartilhaVacina.faixa_etaria, CartilhaVacina.doses).all()

# Validar a vacina do usuário
@router.put("/v1/interno/paciente/validacao/vacina")
def atualizar_status_vacina(atualizar: AtualizarStatusVacinas, db: Session = Depends(get_db)):
    vacina = db.query(UserVaccine).filter(UserVaccine.numero_cpf == atualizar.numero_cpf, UserVaccine.nome_vacina == atualizar.nome_vacina).first()

    if not vacina:
        raise HTTPException(status_code=404, detail="Vacina não encontrada")

    vacina.validacao = atualizar.validacao
    db.commit()

    return {"mensagem": "Status da vacina atualizado com sucesso"}
