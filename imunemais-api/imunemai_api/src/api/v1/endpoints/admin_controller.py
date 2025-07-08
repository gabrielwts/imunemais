# src/api/v1/endpoints/admin_controller.py
from typing import List
from fastapi import APIRouter, HTTPException
from src.schemas.usuario_schemas import LoginAdminRequest
from src.schemas.vacina_schema import VacinaCreate
from src.schemas.funcionario_schemas import ListaTodosFuncionariosCadastrados, VacinaCadastro
from fastapi import APIRouter, Depends, HTTPException
from src.database.database import SessionLocal
from sqlalchemy.orm import Session
from src.app import router
from src.database import models
from src.database.models import CartilhaVacina, RegisteredProfessional, UserVaccine, Usuario
# from src.schemas.funcionario_schemas import FuncionarioCreate
from pydantic import BaseModel

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Admin fixo (você pode mudar isso depois)
ADMIN_USER = "00000000000"
ADMIN_SENHA = "admingps123"

@router.post("/v1/adm/cadastrar/vacina")
def criar_usuario(vacina: VacinaCadastro, db: Session = Depends(get_db)):
    vacina = CartilhaVacina(  
        vacinas_nome=vacina.vacinas_nome,
        descricao=vacina.descricao,
        faixa_etaria=vacina.faixa_etaria,
        doses=vacina.doses
    )

    db.add(vacina)
    db.commit()
    db.refresh(vacina)
    
    usuarios = db.query(Usuario).all()

    # Para cada usuário, registra a nova vacina como pendente
    vacinas_usuarios = []
    for usuario in usuarios:
        vacina_usuario = UserVaccine(
            full_name=usuario.nome_completo,
            numero_cpf=usuario.cpf,
            nome_vacina=vacina.vacinas_nome,
            descricao_vacina=vacina.descricao,
            tipo_dose=vacina.doses,
            validacao="PENDENTE"
        )
        vacinas_usuarios.append(vacina_usuario)

    db.add_all(vacinas_usuarios)
    db.commit()

    return {"mensagem": "Vacina cadastrada com sucesso"}

# Listar todos os funcionários
@router.get("/v1/adm/lista/funcionários/cadastrados", response_model=List[ListaTodosFuncionariosCadastrados])
def listar_funcionarios(db: Session = Depends(get_db)):
    return db.query(RegisteredProfessional.nome_pro, RegisteredProfessional.usuario, RegisteredProfessional.password_prof, RegisteredProfessional.cargo_prof).all()

@router.post("/v1/admin/login")
def login_admin(dados: LoginAdminRequest):
    if dados.cpf == ADMIN_USER and dados.senha == ADMIN_SENHA:
        return {"mensagem": "Login realizado com sucesso", "perfil": "admin"}
    
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

@router.post("v1/vacinas")
def criar_vacina(vacina: VacinaCreate, db: Session = Depends(get_db)):
    nova = models.Vacina(**vacina.dict())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return {"mensagem": "Vacina cadastrada com sucesso", "vacina": nova}

class VacinaCreate(BaseModel):
    nome: str
    descricao: str
    faixa_etaria: str
    dose: str

@router.delete("v1/funcionarios/{id}")
def deletar_funcionario(id: int, db: Session = Depends(get_db)):
    funcionario = db.query(models.Funcionario).filter_by(id=id).first()
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado.")
    db.delete(funcionario)
    db.commit()
    return {"mensagem": "Funcionário deletado com sucesso."}