from typing import List, Optional
from datetime import date, datetime
from pydantic.dataclasses import dataclass
from pydantic import BaseModel
# from src.schemas.usuario_schemas import UserVaccineListBase


# Base comum para criação e resposta de usuários
@dataclass
class AutenticacaoLogin:
    cpf: str
    senha: str

@dataclass
class Token:
    access_token: str
    token_type: str


@dataclass
class TokenData:
    id: int
    usuario: str
    exp: Optional[datetime] = None

class UsuarioComVacinas(BaseModel):
    id: int
    nome: str
    
    telefone: str
    email: str
    cpf: str
    data_nascimento: date
    # vacinas: List[UserVaccineListBase]

class TokenComUsuario(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioComVacinas
