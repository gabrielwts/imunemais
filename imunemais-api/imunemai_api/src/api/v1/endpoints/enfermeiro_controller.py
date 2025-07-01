from fastapi import APIRouter, HTTPException, Query
from imunemai_api.src.database import models
from imunemai_api.src.database.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/enfermeiros", tags=["Enfermeiros"])

# 1. POST - Login
@router.post("/login")
def login(nome: str, cpf: str, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter_by(nome=nome, cpf=cpf).first()
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    return {"mensagem": "Login realizado com sucesso", "usuario": user.nome}

# 2. GET - Consultar paciente por CPF
@router.get("/paciente/{cpf}")
def consultar_paciente(cpf: str, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter_by(cpf=cpf).first()
    if not user:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return user

# 3. GET - Todos os usuários
@router.get("/usuarios")
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(models.Usuario).all()

# 4. GET - Todas vacinas
@router.get("/vacinas")
def listar_vacinas(db: Session = Depends(get_db)):
    return db.query(models.Vacina).all()

# 5. GET - Vacinas por nome (barra de pesquisa)
@router.get("/vacinas/nome")
def buscar_vacina_nome(busca: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.Vacina).filter(models.Vacina.nome.ilike(f"%{busca}%")).all()

# 6. GET - Vacinas por faixa etária
@router.get("/vacinas/faixa-etaria")
def buscar_vacina_faixa(faixa: str = Query(...), db: Session = Depends(get_db)):
    return db.query(models.Vacina).filter(models.Vacina.faixa_etaria == faixa).all()

# 7. PUT - Atualizar paciente
@router.put("/paciente/{cpf}")
def atualizar_paciente(cpf: str, nome: str, db: Session = Depends(get_db)):
    user = db.query(models.Usuario).filter_by(cpf=cpf).first()
    if not user:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    user.nome = nome
    db.commit()
    return {"mensagem": "Paciente atualizado"}

# 8. PUT - Validar/Desvalidar vacina
@router.put("/vacina/{id}/validar")
def validar_vacina(id: int, realizada: bool, db: Session = Depends(get_db)):
    vacina = db.query(models.Vacina).filter_by(id=id).first()
    if not vacina:
        raise HTTPException(status_code=404, detail="Vacina não encontrada")
    vacina.status = "REALIZADA" if realizada else "PENDENTE"
    db.commit()
    return {"mensagem": f"Vacina marcada como {'REALIZADA' if realizada else 'PENDENTE'}"}
