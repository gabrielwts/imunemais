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
from datetime import date, datetime
from reportlab.lib.utils import ImageReader
import os
from reportlab.lib.utils import ImageReader


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
    pdf.drawString(215, 780, "Carteira de Vacinação")
    data_emissao = datetime.now().strftime("%d/%m/%Y às %H:%M")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(222, 765, f"Emitido em: {data_emissao}")
    
    pdf.setStrokeColorRGB(0.85, 0.85, 0.85)
    pdf.setLineWidth(0.5)
    pdf.line(50, 755, 550, 755)    

    # Dados do paciente
    pdf.setFont("Helvetica-Bold", 11)
    y = 715

    pdf.drawString(60, y, "Nome")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(62, y - 17, usuario.nome_completo)

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(310, y, "CPF")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(312, y - 17, usuario.cpf)

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(60, y - 42, "Nascimento")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(62, y - 60, data_formatada)

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(310, y - 42, "Telefone")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(312, y - 60, usuario.telefone)

    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(60, y - 82, "E-mail")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(62, y - 97, usuario.email)
    
    # Marca d’água do brasão
    base_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(base_dir, "../../../static/mmm.png")

    brasao = ImageReader(image_path)
    page_width, page_height = pdf._pagesize
    img_width = 700
    img_height = 950
    x_center = (page_width - img_width) / 2
    y_center = (page_height - img_height) / 2
    pdf.saveState()
    pdf.setFillAlpha(0.08)
    pdf.drawImage(brasao, x_center, y_center, width=img_width, height=img_height, mask='auto')
    pdf.restoreState()
    
    pdf.setStrokeColorRGB(0.85, 0.85, 0.85)
    pdf.setLineWidth(0.5)
    pdf.line(50, 605, 550, 605)    

    # Título da listagem
    y = 565
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Vacinas Aplicadas:")
    y -= 20
    pdf.setFont("Helvetica", 11)

    if not vacinas_realizadas:
        pdf.drawString(52, y, "Nenhuma vacina aplicada no momento.")
        y -= 30
    else:
        for v in vacinas_realizadas:
            texto = f"{v.nome_vacina} — {v.tipo_dose}"
            pdf.drawString(52, y, texto)
            y -= 23
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
        pdf.drawString(52, y, "Nenhuma vacina pendente no momento.")
    else:
        for v in vacinas_pendentes:
            texto = f"{v.nome_vacina} — {v.tipo_dose}"
            pdf.drawString(52, y, texto)
            y -= 23
            if y < 50:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y = 800
                
    # ========================
    # RODAPÉ OFICIAL
    # ========================
    pdf.setFont("Helvetica", 9)

    # Linha de assinatura
    pdf.line(350, 80, 550, 80)
    pdf.drawString(400, 65, "Assinatura do paciente")

    # Aviso de validade nacional
    pdf.setFont("Helvetica", 9)
    pdf.drawCentredString(300, 50,
        "Válido em todo território nacional como comprovante digital de vacinação."
    )

    # Carimbo digital e data/hora
    data_geracao = datetime.now().strftime("%d/%m/%Y às %H:%M")
    pdf.setFont("Helvetica-Oblique", 8.5)
    pdf.drawCentredString(300, 35,
        f"Sistema Imune+ — Ministério da Saúde | Documento gerado automaticamente em {data_geracao}"
    )
    

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

