from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, FastAPI
from src.api.v1.endpoints import admin_controller

# Cria o roteador da API para o endpoint "/users" com a tag "users"
router = APIRouter()


app = FastAPI(
    title="Imunemais"
)  # Cria uma instância do FastAPI, que será a aplicação que vai gerenciar as rotas da API


origins = [
    "http://localhost:4200",  # front-end Angular
    "http://127.0.0.1:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # ou ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)