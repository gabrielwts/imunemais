# src/api/v1/endpoints/admin_controller.py
from fastapi import APIRouter, HTTPException
from src.schemas.usuario_schemas import LoginAdminRequest
from src.schemas.vacina_schema import VacinaCreate
from fastapi import APIRouter, Depends, HTTPException
from src.database.database import SessionLocal
from sqlalchemy.orm import Session
from src.app import router
from src.database import models
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

@router.post("/v1/admin/login")
def login_admin(dados: LoginAdminRequest):
    if dados.cpf == ADMIN_USER and dados.senha == ADMIN_SENHA:
        return {"mensagem": "Login realizado com sucesso", "perfil": "admin"}
    
    raise HTTPException(status_code=401, detail="Credenciais inválidas")

@router.post("/vacinas")
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

@router.post("/vacinas")
def criar_vacina(vacina: VacinaCreate, db: Session = Depends(get_db)):
    nova = models.Vacina(**vacina.dict())
    db.add(nova)
    db.commit()
    db.refresh(nova)
    return {"mensagem": "Vacina cadastrada com sucesso", "vacina": nova}

# @router.post("/funcionarios", response_model=FuncionarioRead)
# def criar_funcionario(dados: FuncionarioCreate, db: Session = Depends(get_db)):
#     existente = db.query(models.Funcionario).filter_by(usuario=dados.usuario).first()
#     if existente:
#         raise HTTPException(status_code=400, detail="Usuário já existe.")
#     novo = models.Funcionario(**dados.dict())
#     db.add(novo)
#     db.commit()
#     db.refresh(novo)
#     return novo

# @router.get("/funcionarios", response_model=list[FuncionarioRead])
# def listar_funcionarios(db: Session = Depends(get_db)):
#     return db.query(models.Funcionario).all()

# @router.put("/funcionarios/{id}")
# def atualizar_funcionario(id: int, dados: FuncionarioCreate, db: Session = Depends(get_db)):
#     funcionario = db.query(models.Funcionario).filter_by(id=id).first()
#     if not funcionario:
#         raise HTTPException(status_code=404, detail="Funcionário não encontrado.")
#     for campo, valor in dados.dict().items():
#         setattr(funcionario, campo, valor)
#     db.commit()
#     return {"mensagem": "Funcionário atualizado com sucesso."}

@router.delete("/funcionarios/{id}")
def deletar_funcionario(id: int, db: Session = Depends(get_db)):
    funcionario = db.query(models.Funcionario).filter_by(id=id).first()
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado.")
    db.delete(funcionario)
    db.commit()
    return {"mensagem": "Funcionário deletado com sucesso."}