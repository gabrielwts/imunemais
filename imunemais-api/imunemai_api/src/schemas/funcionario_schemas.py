from typing import Optional
from pydantic import BaseModel
from fastapi import UploadFile

# ====== PROFISSIONAIS REGISTRADOS ====== #
class ProfissionalBase(BaseModel):
    nome_pro: str
    usuario: str
    password_prof: str
    cargo_prof: str
    profile_photo: str


class FuncionarioCreateResponse(BaseModel):
    id: int


class Profissional(ProfissionalBase):
    id: int

    model_config = {
    "from_attributes": True
    }

class LoginAdminRequest(BaseModel):
    usuario: str
    senha: str
    
class VacinaCadastro(BaseModel):
    vacinas_nome: str
    descricao: Optional[str]
    faixa_etaria: str
    doses: str
    
class ListaTodosFuncionariosCadastrados(BaseModel):
    nome_pro: str
    usuario: str
    password_prof: str
    cargo_prof: str
    profile_photo: str
    
    class Config:
        orm_mode = True


class DeletarFuncionario(BaseModel):
    nome_pro: str
    usuario: str
    password_prof: str
    cargo_prof: str
    profile_photo: str


class AtualizarDados(BaseModel):
    usuario_original: str
    
    nome_pro: Optional[str] = None
    usuario: Optional[str] = None
    password_prof: Optional[str] = None
    cargo_prof: Optional[str] = None
    profile_photo: Optional[str] = None
    
    