from typing import List, Optional
from datetime import date, datetime
from pydantic.dataclasses import dataclass
from pydantic import BaseModel, Field
# from src.schemas.usuario_schemas import UserVaccineListBase


# Base comum para criação e resposta de usuários
@dataclass
class AutenticacaoLogin:
    cpf: str
    senha: str
    
class AdmAutenticacaoLogin(BaseModel):
    usuario: str
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
    imagem_perfil: str
    # vacinas: List[UserVaccineListBase]
    
    class Config:
        orm_mode = True

class TokenComPaciente(BaseModel):
    access_token: str
    token_type: str = "bearer"
    paciente: UsuarioComVacinas
    

class AdmUsuarioDados(BaseModel):
    id: int
    nome: str
    usuario: str
    profissional: str
    profile_photo: str
    
class AdmComToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: AdmUsuarioDados

class RecuperarSenhaRequest(BaseModel):
    email: str
    cpf: str

class RecuperarSenhaEmailRequest(BaseModel):
    email: str