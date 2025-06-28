from src.database.database import SessionLocal
from fastapi import APIRouter, HTTPException, Depends
from src.schemas.usuario_schemas import AtualizarDados, CpfRecuperarSenha, UsuarioContatoMascarado, UsuarioCreate, UsuarioCreateResponse, UsuarioSetPassword, LoginRequest
from src.auth.crypto import verificar_senha
from src.database.models import Usuario, CartilhaVacina, UserVaccine
from sqlalchemy.orm import Session
from src.app import router
from src.auth.crypto import gerar_hash_senha
from src.auth.mascaradores import mascarar_email, mascarar_telefone

# Dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Cadastrar usuário
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
    
    vacinas_cartilha = db.query(CartilhaVacina).all()

    # Para cada vacina, cria um registro pendente para o novo usuário
    
    for vacina in vacinas_cartilha:
        nova_vacina_usuario = UserVaccine(
            full_name=usuario.nome_completo,
            numero_cpf=usuario.cpf,
            nome_vacina=vacina.vacinas_nome,
            tipo_dose=vacina.doses,
            validacao="PENDENTE",
        )
        db.add(nova_vacina_usuario)
        
    db.add(nova_vacina_usuario)
    db.commit()
    db.refresh(nova_vacina_usuario)
    
    return UsuarioCreateResponse(id=db_usuario.id)

# Cadastrar senha usuário
@router.post("/v1/usuarios/senha")
def criar_senha(id: int, usuarioSenha: UsuarioSetPassword, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
    db_usuario = db.query(Usuario).filter(Usuario.id == id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if not usuarioSenha.password_hash or len(usuarioSenha.password_hash) < 6:
        raise HTTPException(status_code=400, detail="Senha deve ter pelo menos 6 caracteres.")

    senha_hash = gerar_hash_senha(usuarioSenha.password_hash)
    db_usuario.password_hash = senha_hash

    db.add(db_usuario)
    db.commit()
    db.refresh(db_usuario)

    return UsuarioCreateResponse(id=db_usuario.id)

# # Login do usuário
# @router.post("/v1/usuarios/login")
# def login(autenticar: LoginRequest, db: Session = Depends(get_db)) -> UsuarioCreateResponse:
#     usuario = db.query(Usuario).filter(Usuario.cpf == autenticar.cpf).first()
    
    
#     # if not usuario or not verificar_senha(autenticar.password_hash, usuario.password_hash):
#     #     raise HTTPException(status_code=401, detail="Credenciais inválidas")
#     #     # Gerar token, ou simplesmente retornar o usuário autenticado:
#     return {"id": usuario.id}

# Recuperar senha, entrada do cpf e return do telefone + email
@router.post("/v1/usuarios/recuperarsenha", response_model=UsuarioContatoMascarado)
def recuperar_senha(recuperar: CpfRecuperarSenha, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.cpf == recuperar.cpf).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return UsuarioContatoMascarado(
        telefone=mascarar_telefone(usuario.telefone),
        email=mascarar_email(usuario.email)
    )
    
# Atualizar e-mail e telefone do usuário (profile)
@router.put("/v1/usuarios/atualizardados")
def atualizar_dados(atualizar: AtualizarDados, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == id).first()
    
    if atualizar.email:
        usuario.email = atualizar.email
    if atualizar.telefone:
        usuario.telefone = atualizar.telefone
        
    db.commit()
    db.refresh(usuario)

    return {"mensagem": "Dados de contato atualizados com sucesso"}