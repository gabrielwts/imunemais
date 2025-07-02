from pydantic import BaseModel

class FuncionarioBase(BaseModel):
    nome: str
    usuario: str
    senha: str
    cargo: str

class FuncionarioCreate(FuncionarioBase):
    pass

class FuncionarioRead(FuncionarioBase):
    id: int

    class Config:
        orm_mode = True
