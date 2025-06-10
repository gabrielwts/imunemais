# src/api/v1/endpoints/admin_controller.py
from fastapi import APIRouter, HTTPException
from src.schemas.usuario_schemas import LoginAdminRequest

router = APIRouter()

# Admin fixo (você pode mudar isso depois)
ADMIN_CPF = "00000000000"
ADMIN_SENHA = "admin123"

@router.post("/v1/admin/login")
def login_admin(dados: LoginAdminRequest):
    if dados.cpf == ADMIN_CPF and dados.senha == ADMIN_SENHA:
        return {"mensagem": "Login realizado com sucesso", "perfil": "admin"}
    
    raise HTTPException(status_code=401, detail="Credenciais inválidas")
