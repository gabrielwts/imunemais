from src.database.database import SessionLocal
from fastapi import APIRouter, HTTPException, Depends, FastAPI, Response
from src.schemas.usuario_schemas import AtualizarDadosComCpf, CpfRecuperarSenha, UsuarioContatoMascarado, UsuarioCreate, UsuarioCreateResponse, UsuarioSetPassword, LoginRequest
from src.auth.crypto import verificar_senha
from src.database.models import Usuario, CartilhaVacina, UserVaccine
from sqlalchemy.orm import Session
from src.app import router
from src.auth.crypto import gerar_hash_senha
from src.auth.mascaradores import mascarar_email, mascarar_telefone
from fastapi import UploadFile, File, Form
from typing import Optional
from pydantic import EmailStr
import shutil, uuid
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import date


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
        imagem_perfil="/static/perfis/standard-user.jpg"
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
            descricao_vacina=vacina.descricao,
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

# Recuperar senha, entrada do cpf e return do telefone + email
@router.post("/v1/usuarios/recuperarsenha", response_model=UsuarioContatoMascarado)
def recuperar_senha(recuperar: CpfRecuperarSenha, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.cpf == recuperar.cpf).first()
    
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return UsuarioContatoMascarado(
        telefone=mascarar_telefone(usuario.telefone),
        email=mascarar_email(usuario.email),
        cpf=usuario.cpf,
        email_real=usuario.email
    )

@router.put("/v1/usuarios/atualizardados")
def atualizar_dados(
    cpf: str = Form(...),
    telefone: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    imagem_perfil: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    usuario = db.query(Usuario).filter(Usuario.cpf == cpf).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    if telefone is not None:
        usuario.telefone = telefone

    if email is not None:
        usuario.email = email

    if imagem_perfil:
        filename = f"{uuid.uuid4().hex}_{imagem_perfil.filename}"
        caminho = f"src/static/perfis/{filename}"

        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(imagem_perfil.file, buffer)

        usuario.imagem_perfil = f"/static/perfis/{filename}"

    db.commit()
    db.refresh(usuario)

    return {
        "cpf": usuario.cpf,
        "nome": usuario.nome_completo,
        "data_nascimento": usuario.data_nascimento,
        "telefone": usuario.telefone,
        "email": usuario.email,
        "imagem_perfil": usuario.imagem_perfil
    }



# GERAR PDF CARTEIRINHA DE VACINA
@router.get("/v1/usuarios/carteira-vacina/{cpf}")
async def gerar_carteira(cpf: str, db: Session = Depends(get_db)):
    # Buscar usuário
    usuario = db.query(Usuario).filter(Usuario.cpf == cpf).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Buscar vacinas do usuário
    vacinas_realizadas = (
        db.query(UserVaccine)
        .filter(UserVaccine.numero_cpf == cpf, UserVaccine.validacao == "REALIZADA")
        .all()
    )

    vacinas_pendentes = (
        db.query(UserVaccine)
        .filter(UserVaccine.numero_cpf == cpf, UserVaccine.validacao == "PENDENTE")
        .all()
    )
    
    data_formatada = (
        usuario.data_nascimento.strftime("%d/%m/%Y")
        if isinstance(usuario.data_nascimento, date)
        else str(usuario.data_nascimento)
    )

    # Criar PDF
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)

    # Cabeçalho
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(215, 800, "Carteira de Vacinação")

    # Dados do paciente
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, 770, f"Nome completo: {usuario.nome_completo}")
    pdf.drawString(50, 750, f"CPF: {usuario.cpf}")
    pdf.drawString(50, 730, f"Nascimento: {data_formatada}")
    pdf.drawString(50, 710, f"Telefone: {usuario.telefone}")
    pdf.drawString(50, 690, f"E-mail: {usuario.email}")

    # Título da listagem
    y = 660
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Vacinas Aplicadas:")
    y -= 20
    pdf.setFont("Helvetica", 11)

    if not vacinas_realizadas:
        pdf.drawString(50, y, "Nenhuma vacina aplicada no momento.")
        y -= 30
    else:
        for v in vacinas_realizadas:
            texto = f"{v.nome_vacina} — {v.tipo_dose}"
            pdf.drawString(50, y, texto)
            y -= 18
            if y < 50:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y = 800

        y -= 15

    # ========================
    # VACINAS PENDENTES
    # ========================
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Vacinas Pendentes:")
    y -= 20
    pdf.setFont("Helvetica", 11)

    if not vacinas_pendentes:
        pdf.drawString(50, y, "Nenhuma vacina pendente no momento.")
    else:
        for v in vacinas_pendentes:
            texto = f"{v.nome_vacina} — {v.tipo_dose}"
            pdf.drawString(50, y, texto)
            y -= 18
            if y < 50:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y = 800

    pdf.showPage()
    pdf.save()
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=carteira_{cpf}.pdf"
        }
    )

