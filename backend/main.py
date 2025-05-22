from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend.routes import cartilha, vacinas, usuarios, profissionais


Base.metadata.create_all(bind=engine)

app = FastAPI() 

@app.get("/")
def get_languages():
    return { "sucess" : "foi" }

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(vacinas.router)
app.include_router(profissionais.router)
app.include_router(cartilha.router)