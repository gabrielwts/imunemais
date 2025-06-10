from src.database.database import SessionLocal
from fastapi import APIRouter, HTTPException, Depends
from src.schemas.usuario_schemas import UsuarioCreate, UsuarioCreateResponse, UsuarioSetPassword, LoginRequest
from src.auth.crypto import verificar_senha
from src.database.models import Usuario
from sqlalchemy.orm import Session
from src.app import router

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/v1/usuarios")
def criar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
    db_usuario = Usuario(
        nome_completo=usuario.nome_completo,
        cpf=usuario.cpf,
        data_nascimento=usuario.data_nascimento,
        telefone=usuario.telefone,
        email=usuario.email,
    )
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return UsuarioCreateResponse(id=db_usuario.id)

@router.put("/v1/usuarios/senha")
def criar_senha(id: int, usuarioSenha: UsuarioSetPassword, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
    db_usuario = db.query(Usuario).filter(Usuario.id == id).first()
    
    db_usuario.password_hash = usuarioSenha.password_hash
    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)
    return UsuarioCreateResponse(id=db_usuario.id)

@router.post("/v1/usuarios/login")
def login(autenticar: LoginRequest, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
    usuario = db.query(Usuario).filter(Usuario.cpf == autenticar.cpf).first()
    
    
    # if not usuario or not verificar_senha(autenticar.password_hash, usuario.password_hash):
    #     raise HTTPException(status_code=401, detail="Credenciais inválidas")
    #     # Gerar token, ou simplesmente retornar o usuário autenticado:
    return {"id": usuario.id}