from fastapi import APIRouter

router = APIRouter(prefix="/cartilha", tags=["Cartilha"])

@router.get("/")
def listar_vacinas_cartilha():
    return {"message": "Vacinas da cartilha"}