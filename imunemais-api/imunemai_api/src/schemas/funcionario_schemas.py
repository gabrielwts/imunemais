from typing import Optional
from pydantic import BaseModel

# ====== PROFISSIONAIS REGISTRADOS ====== #
class ProfissionalBase(BaseModel):
    nome_pro: str
    usuario: str
    password_prof: str
    cargo_prof: str


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
    
    class Config:
        orm_mode = True
        