from fastapi import APIRouter

router = APIRouter(prefix="/vacinas", tags=["Vacinas"])

@router.get("/")
def listar_vacinas():
    return {"message": "Lista de vacinas"}

# Pode incluir post, put, delete conforme necessário