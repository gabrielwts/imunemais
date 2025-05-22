from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from backend.database import Base

class Usuario(Base):
    __tablename__ = "usuarios_cadastrados"

    id = Column(Integer, primary_key=True, index=True)
    nome_completo = Column(String(150), nullable=False)
    cpf = Column(String(14), unique=True, nullable=False)
    data_nascimento = Column(String(10), nullable=False)
    telefone = Column(String(15), nullable=False)
    email = Column(String(254), nullable=False)
    password_hash = Column(String(150), nullable=False)


class UserVaccine(Base):
    __tablename__ = "user_vaccines"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    numero_cpf = Column(String(14), ForeignKey("usuarios_cadastrados.cpf", ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
    nome_vacina = Column(String(150), nullable=False)
    data_dose_tomada = Column(Date, nullable=False)
    tipo_dose = Column(String(50), nullable=False)
    validacao = Column(String(25), nullable=False)
    profissional = Column(String(150), nullable=False)
    user_id = Column(Integer, nullable=True)  # Pode remover se não estiver sendo usado


class CartilhaVacina(Base):
    __tablename__ = "cartilha_vacinas"

    id = Column(Integer, primary_key=True, index=True)
    vacinas_nome = Column(String(150), nullable=False)
    descricao = Column(Text)
    faixa_etaria = Column(String(50), nullable=False)
    doses = Column(String(50), nullable=False)
    data_registro = Column(Date, nullable=False)


class RegisteredProfessional(Base):
    __tablename__ = "registered_professionals"

    id = Column(Integer, primary_key=True, index=True)
    nome_pro = Column(String(150), nullable=False)
    usuario = Column(String(50), nullable=False)
    password_prof = Column(String(150), nullable=False)
    person_paper = Column(String(50), nullable=False)