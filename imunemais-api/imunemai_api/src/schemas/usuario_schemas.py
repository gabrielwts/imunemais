from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime


# ====== USUÁRIOS CADASTRADOS ====== #
class UsuarioBase(BaseModel):
    nome_completo: str
    cpf: str
    data_nascimento: str
    telefone: str
    email: EmailStr


class UsuarioCreate(BaseModel):
    nome_completo: str = Field(alias="nome")
    cpf: str
    data_nascimento: datetime = Field(alias="dataNascimento")
    telefone: str
    email: EmailStr


class UsuarioSetPassword(BaseModel):
    password_hash: str = Field(alias="senha")


class Usuario(UsuarioBase):
    id: int

    model_config = {
    "from_attributes": True
    }

class UsuarioCreateResponse(BaseModel):
    id: int

class LoginRequest(BaseModel):
    cpf: str
    password_hash: str = Field(alias="senha")
    
class CpfRecuperarSenha(BaseModel):
    cpf: str
    
class UsuarioContatoMascarado(BaseModel):
    telefone: str
    email: str
    
class AtualizarDados(BaseModel):
    telefone: str
    email: str

# ====== VACINAS DO USUÁRIO ====== #
class UserVaccineBase(BaseModel):
    full_name: str
    numero_cpf: str
    nome_vacina: str
    descricao_vacina: str
    data_dose_tomada: date
    tipo_dose: str
    validacao: str
    
class ListaUserVacinaResponse(BaseModel):
    nome_vacina: str
    tipo_dose: str
    descricao_vacina: str
    numero_cpf: str
    validacao: str

class UserVaccineCreate(UserVaccineBase):
    user_id: Optional[int]

class UserVaccines(UserVaccineBase):
    id: int
    user_id: Optional[int]

    model_config = {
    "from_attributes": True
    }

class LoginAdminRequest(BaseModel):
    cpf: str
    senha: str

# ====== CARTILHA DE VACINAS ====== #
class CartilhaVacinaBase(BaseModel):
    vacinas_nome: str
    descricao: Optional[str]
    faixa_etaria: str
    doses: str


class CartilhaVacinaCreate(CartilhaVacinaBase):
    pass


class CartilhaVacina(CartilhaVacinaBase):
    id: int
    data_registro: date

    model_config = {
    "from_attributes": True
    }
