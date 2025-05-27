from sqlalchemy.orm import Session
from . import models, schemas

def criar_pessoa(db: Session, pessoa: schemas.PessoaCreate):
    nova_pessoa = models.Pessoa(**pessoa.dict())
    db.add(nova_pessoa)
    db.commit()
    db.refresh(nova_pessoa)
    return nova_pessoa
