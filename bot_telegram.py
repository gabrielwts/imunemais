import logging
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler, ConversationHandler,
    ContextTypes, filters
)
import requests

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

BOT_TOKEN = "7947564259:AAHE5xZBYJLaYQIVioJEhDpsA1k4JOCBFsg"  # <--- Troque pelo token do seu bot

API_URL = "http://127.0.0.1:8000"  # URL da sua API FastAPI local

CPF, SENHA, MENU = range(3)

usuarios_logados = {}  # chat_id : cpf

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Olá! Para começar, digite seu CPF:"
    )
    return CPF

async def receber_cpf(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    cpf = update.message.text.strip()
    context.user_data['cpf'] = cpf
    await update.message.reply_text("Agora digite sua senha:")
    return SENHA

async def receber_senha(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    senha = update.message.text.strip()
    cpf = context.user_data.get('cpf')

    # Tenta autenticar na API
    try:
        response = requests.post(f"{API_URL}/login", json={"cpf": cpf, "senha": senha})
        if response.status_code == 200:
            usuarios_logados[update.effective_chat.id] = cpf
            await update.message.reply_text(
                "✅ Login realizado com sucesso!\nEscolha uma opção:",
                reply_markup=ReplyKeyboardMarkup(
                    [["Ver vacinas tomadas", "Ver vacinas pendentes"],
                     ["Ver dados do paciente", "Sair"]],
                    one_time_keyboard=True,
                    resize_keyboard=True
                )
            )
            return MENU
        else:
            await update.message.reply_text("❌ CPF ou senha inválidos. Tente novamente.\nDigite seu CPF:")
            return CPF
    except Exception as e:
        await update.message.reply_text("Erro na comunicação com o servidor. Tente mais tarde.")
        logging.error(f"Erro na API /login: {e}")
        return ConversationHandler.END

async def menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    escolha = update.message.text
    chat_id = update.effective_chat.id

    if chat_id not in usuarios_logados:
        await update.message.reply_text("Você não está logado. Use /start para começar.")
        return ConversationHandler.END

    cpf = usuarios_logados[chat_id]

    if escolha == "Ver vacinas tomadas":
        try:
            r = requests.get(f"{API_URL}/vacinas/tomadas/{cpf}")
            if r.status_code == 200:
                vacinas = r.json()
                texto = "Vacinas tomadas:\n" + "\n".join([f"- {v['nome']} em {v['data']}" for v in vacinas])
                await update.message.reply_text(texto)
            else:
                await update.message.reply_text("Não foi possível obter as vacinas tomadas.")
        except Exception as e:
            await update.message.reply_text("Erro na comunicação com o servidor.")
            logging.error(f"Erro na API /vacinas/tomadas: {e}")

    elif escolha == "Ver vacinas pendentes":
        try:
            r = requests.get(f"{API_URL}/vacinas/pendentes/{cpf}")
            if r.status_code == 200:
                vacinas = r.json()
                texto = "Vacinas pendentes:\n" + "\n".join([f"- {v['nome']}" for v in vacinas])
                await update.message.reply_text(texto)
            else:
                await update.message.reply_text("Não foi possível obter as vacinas pendentes.")
        except Exception as e:
            await update.message.reply_text("Erro na comunicação com o servidor.")
            logging.error(f"Erro na API /vacinas/pendentes: {e}")

    elif escolha == "Ver dados do paciente":
        try:
            r = requests.get(f"{API_URL}/paciente/{cpf}")
            if r.status_code == 200:
                dados = r.json()
                texto = (
                    f"Dados do paciente:\n"
                    f"Nome: {dados.get('nome', 'N/A')}\n"
                    f"CPF: {dados.get('cpf', 'N/A')}\n"
                    f"Data de nascimento: {dados.get('data_nascimento', 'N/A')}\n"
                )
                await update.message.reply_text(texto)
            else:
                await update.message.reply_text("Não foi possível obter os dados do paciente.")
        except Exception as e:
            await update.message.reply_text("Erro na comunicação com o servidor.")
            logging.error(f"Erro na API /paciente: {e}")

    elif escolha == "Sair":
        usuarios_logados.pop(chat_id, None)
        await update.message.reply_text("Você saiu da sua conta.", reply_markup=ReplyKeyboardRemove())
        return ConversationHandler.END

    else:
        await update.message.reply_text("Opção inválida. Por favor, escolha uma opção do menu.")

    return MENU

async def cancelar(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("Operação cancelada. Use /start para iniciar novamente.", reply_markup=ReplyKeyboardRemove())
    return ConversationHandler.END

def main():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            CPF: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_cpf)],
            SENHA: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_senha)],
            MENU: [MessageHandler(filters.TEXT & ~filters.COMMAND, menu)],
        },
        fallbacks=[CommandHandler("cancel", cancelar)],
    )

    app.add_handler(conv_handler)

    print("🤖 Bot está rodando...")
    app.run_polling()

if __name__ == "__main__":
    main()
