# src/api/v1/endpoints/admin_controller.py
from typing import List, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from src.schemas.usuario_schemas import LoginAdminRequest
from src.schemas.vacina_schema import VacinaCreate
from src.schemas.funcionario_schemas import AtualizarDados, DeletarFuncionario, ListaTodosFuncionariosCadastrados, VacinaCadastro
from fastapi import APIRouter, Depends, HTTPException
from src.database.database import SessionLocal
from sqlalchemy.orm import Session
from src.app import router
from src.database import models
from src.auth.crypto import gerar_hash_senha
from src.database.models import CartilhaVacina, RegisteredProfessional, UserVaccine, Usuario
# from src.schemas.funcionario_schemas import FuncionarioCreate
from pydantic import BaseModel
from fastapi import UploadFile, File
from uuid import uuid4
import os

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
# Admin fixo 
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
    return db.query(RegisteredProfessional.nome_pro, RegisteredProfessional.usuario, RegisteredProfessional.password_prof, RegisteredProfessional.cargo_prof, RegisteredProfessional.profile_photo).all()

class VacinaCreate(BaseModel):
    nome: str
    descricao: str
    faixa_etaria: str
    dose: str

# Deletar funcionário
@router.delete("/v1/adm/funcionario/deletar")
def deletar_funcionario(usuario: str, db: Session = Depends(get_db)):
    funcionario = db.query(RegisteredProfessional).filter_by(usuario=usuario).first()
    
    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado.")

    db.delete(funcionario)
    db.commit()
    return {"mensagem": "Funcionário deletado com sucesso."}

# Atualizar dados dos funcionários
@router.put("/v1/adm/funcionario/alterar")
def atualizar_dados(atualizar: AtualizarDados, db: Session = Depends(get_db)):
    usuario = db.query(RegisteredProfessional).filter_by(usuario=atualizar.usuario_original).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if atualizar.nome_pro is not None:
        usuario.nome_pro = atualizar.nome_pro

    if atualizar.usuario is not None:
        usuario.usuario = atualizar.usuario
        
    if atualizar.password_prof is not None:
        if len(atualizar.password_prof) < 6:
            raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres.")
        usuario.password_prof = gerar_hash_senha(atualizar.password_prof)
        
    if atualizar.cargo_prof is not None:
        usuario.cargo_prof = atualizar.cargo_prof
        
    if atualizar.profile_photo is not None:
        usuario.profile_photo = atualizar.profile_photo

    db.commit()
    db.refresh(usuario)

    return {"mensagem": "Dados atualizados com sucesso"}

@router.put("/v1/adm/funcionario/alterar-com-foto")
def atualizar_dados_com_foto(
    usuario_original: str = Form(...),
    nome_pro: Optional[str] = Form(None),
    usuario: Optional[str] = Form(None),
    password_prof: Optional[str] = Form(None),
    cargo_prof: Optional[str] = Form(None),
    profile_photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    usuario_obj = db.query(RegisteredProfessional).filter_by(usuario=usuario_original).first()

    if not usuario_obj:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if nome_pro is not None:
        usuario_obj.nome_pro = nome_pro

    if usuario is not None:
        usuario_obj.usuario = usuario

    if password_prof is not None:
        if len(password_prof) < 6:
            raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres.")
        usuario_obj.password_prof = gerar_hash_senha(password_prof)

    if cargo_prof is not None:
        usuario_obj.cargo_prof = cargo_prof

    if profile_photo:
        import uuid, shutil
        filename = f"{uuid.uuid4().hex}_{profile_photo.filename}"
        caminho = f"src/static/perfis/{filename}"
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(profile_photo.file, buffer)

        usuario_obj.profile_photo = f"/static/perfis/{filename}"

    db.commit()
    db.refresh(usuario_obj)

    return {
        "usuario": usuario_obj.usuario,
        "nome_pro": usuario_obj.nome_pro,
        "cargo_prof": usuario_obj.cargo_prof,
        "profile_photo": usuario_obj.profile_photo
    }
