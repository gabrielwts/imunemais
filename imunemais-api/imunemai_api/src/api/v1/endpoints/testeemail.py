import secrets
import asyncio
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# Função para gerar código
def gerar_codigo():
    return f"{secrets.randbelow(10000):04d}"

# Configuração do e-mail
conf = ConnectionConfig(
    MAIL_USERNAME="suporte.imunemais@gmail.com",
    MAIL_PASSWORD="obuq ovqt pits ejhn",  # senha de app do Gmail
    MAIL_FROM="suporte.imunemais@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

# Função para enviar e-mail
async def enviar_email(destinatario: str, codigo: str):
    mensagem = MessageSchema(
        subject="Recuperação de senha",
        recipients=[destinatario],
        body=f"Seu código de recuperação é: {codigo}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(mensagem)
    print(f"E-mail enviado para {destinatario} com o código {codigo}")

# Executa o teste
if __name__ == "__main__":
    codigo = gerar_codigo()
    print(f"Código gerado: {codigo}")
    asyncio.run(enviar_email("jorgegabrielrf@gmail.com", codigo))