from pydantic import BaseModel

class VacinaCreate(BaseModel):
    nome: str
    descricao: str
    faixa_etaria: str
    dose: str
