from dataclasses import dataclass, field
from datetime import datetime, date
from src.database import models
from src.app import app
from src.database.database import Base, engine
import uvicorn
# from dataclasses_json import dataclass_json, LetterCase
from fastapi import FastAPI, HTTPException, status
from fastapi.openapi.models import Response
from fastapi.openapi.utils import status_code_ranges
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware
from src.api.v1.endpoints import usuario_controller, admin_controller, autenticacao_controller, enfermeiro_controller


# Cria as tabelas no banco de dados. Este comando verifica todos os modelos definidos em Base e cria as
# tabelas correspondentes no banco de dados.
# Em um projeto real, você pode querer usar Alembic para gerenciar migrações do banco de dados.
Base.metadata.create_all(bind=engine)


@app.get("/")
def index():
    return {"mensagem": "Olá mundo"}

app.include_router(usuario_controller.router)
app.include_router(admin_controller.router)
app.include_router(autenticacao_controller.router)
app.include_router(enfermeiro_controller.router)

if __name__ == "__main__":
    uvicorn.run("main:app")
    
    


