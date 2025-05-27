from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


# ==== USUÁRIOS CADASTRADOS ====
class UsuarioBase(BaseModel):
    nome_completo: str
    cpf: str
    data_nascimento: str
    telefone: str
    email: EmailStr


class UsuarioCreate(BaseModel):
    nome_completo: str
    cpf: str
    data_nascimento: str
    telefone: str
    email: EmailStr


class UsuarioSetPassword(BaseModel):
    password_hash: str


class Usuario(UsuarioBase):
    id: int

    model_config = {
    "from_attributes": True
    }

class UsuarioCreateResponse(BaseModel):
    id: int


# ==== VACINAS DO USUÁRIO ====
class UserVaccineBase(BaseModel):
    full_name: str
    numero_cpf: str
    nome_vacina: str
    data_dose_tomada: date
    tipo_dose: str
    validacao: str
    profissional: str


class UserVaccineCreate(UserVaccineBase):
    user_id: Optional[int]


class UserVaccine(UserVaccineBase):
    id: int
    user_id: Optional[int]

    model_config = {
    "from_attributes": True
    }


# ==== CARTILHA DE VACINAS ====
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


# ==== PROFISSIONAIS REGISTRADOS ====
class ProfissionalBase(BaseModel):
    nome_pro: str
    usuario: str
    password_prof: str
    person_paper: str


class ProfissionalCreate(ProfissionalBase):
    pass


class Profissional(ProfissionalBase):
    id: int

    model_config = {
    "from_attributes": True
    }