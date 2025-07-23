from sqlalchemy import Column, DateTime, Integer, String, Date, ForeignKey, Float, func
from sqlalchemy.orm import relationship
from src.database.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome_completo = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    telefone = Column(String(15), nullable=False)
    email = Column(String(254), nullable=False)
    password_hash = Column(String(150), nullable=True)
    imagem_perfil = Column(String, nullable=True, default="/static/perfis/standard-user.jpg")


class UserVaccine(Base):
    __tablename__ = "vacinas_do_usuario"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    numero_cpf = Column(String(14), ForeignKey("usuarios.cpf", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    nome_vacina = Column(String(150), nullable=False)
    descricao_vacina = Column(String(255), nullable=False)
    tipo_dose = Column(String(150), nullable=False)
    validacao = Column(String(25), nullable=False) # valores que vai receber: PENDENTE e REALIZADA
    user_id = Column(Integer, nullable=True)  # Pode remover se não estiver sendo usado


class CartilhaVacina(Base):
    __tablename__ = "cartilha_vacinas"

    id = Column(Integer, primary_key=True, index=True)
    vacinas_nome = Column(String(150), nullable=False)
    descricao = Column(String(255), nullable=False)
    faixa_etaria = Column(String(50), nullable=False)
    doses = Column(String(150), nullable=False)
    
# class Vacina(Base):
#     __tablename__ = "vacinas"

#     id = Column(Integer, primary_key=True, index=True)
#     nome = Column(String)
#     descricao = Column(String)
#     faixa_etaria = Column(String)
#     dose = Column(String)
#     status = Column(String, default="PENDENTE")


class RegisteredProfessional(Base):
    __tablename__ = "profissionais_registrados"

    id = Column(Integer, primary_key=True, index=True)
    nome_pro = Column(String(150), nullable=False)
    usuario = Column(String(50), nullable=False)
    password_prof = Column(String(150), nullable=False)
    cargo_prof = Column(String(50), nullable=False)
    
# class Funcionario(Base):
#     __tablename__ = "funcionarios"

#     id = Column(Integer, primary_key=True, index=True)
#     nome = Column(String, nullable=False)
#     usuario = Column(String, unique=True, nullable=False)
#     senha = Column(String, nullable=False)
#     cargo = Column(String, nullable=False)

