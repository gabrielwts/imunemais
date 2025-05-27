from fastapi import APIRouter

router = APIRouter(prefix="/profissionais", tags=["Profissionais"])

@router.get("/")
def listar_profissionais():
    return {"message": "Lista de profissionais"}