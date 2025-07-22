import logging
import requests
import json
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CallbackQueryHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

MENU, ALTERAR_DADOS = range(2)
LOGIN_FILE = "login_dados.json"
API_URL_VACINAS = "http://127.0.0.1:8000/v1/paciente/vacinas"
API_URL_ATUALIZAR_DADOS = "http://127.0.0.1:8000/v1/usuarios/atualizardados"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def qualquer_mensagem(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        with open(LOGIN_FILE, "r") as f:
            dados = json.load(f)
            context.user_data['usuario'] = dados["usuario"]
            context.user_data['token'] = dados["access_token"]
    except Exception:
        await update.message.reply_text(
            "⚠️ Você não está logado.\n"
            "Por favor, faça login acessando:\n\n"
            "http://localhost:5000/login\n\n"
            "Depois volte aqui e envie qualquer mensagem para continuar."
        )
        return ConversationHandler.END

    usuario = context.user_data.get("usuario", {})
    nome = usuario.get("nome") or "Usuário"

    await update.message.reply_text(
        f"✅ Login efetuado! Bem-vindo(a), {nome}.\n\n"
        "🤖 Envie qualquer mensagem para continuar a consulta."
    )

    await enviar_menu(update, context)
    return MENU


async def enviar_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("✅ Ver dados", callback_data='ver_dados')],
        [InlineKeyboardButton("💉 Ver vacinas tomadas", callback_data='ver_vacinas_tomadas')],
        [InlineKeyboardButton("🕒 Ver vacinas pendentes", callback_data='ver_vacinas_pendentes')],
        [InlineKeyboardButton("✏️ Alterar dados", callback_data='alterar_dados')],
        [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if update.message:
        await update.message.reply_text("Escolha uma opção:", reply_markup=reply_markup)
    else:
        await update.callback_query.edit_message_text("Escolha uma opção:", reply_markup=reply_markup)


async def menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    usuario = context.user_data.get('usuario', {})
    token = context.user_data.get('token')
    cpf = usuario.get('cpf')

    if query.data == 'ver_dados':
        nome = usuario.get("nome", "N/A")
        telefone = usuario.get("telefone", "N/A")
        email = usuario.get("email", "N/A")
        data_nascimento = usuario.get("data_nascimento", "N/A")

        texto = (
            f"👤 Dados do Usuário:\n"
            f"Nome: {nome}\n"
            f"Telefone: {telefone}\n"
            f"E-mail: {email}\n"
            f"Data Nascimento: {data_nascimento}"
        )

        await mostrar_opcoes_voltar(query, texto)

    elif query.data == 'ver_vacinas_tomadas':
        await mostrar_vacinas(query, context, cpf, token, "REALIZADA")

    elif query.data == 'ver_vacinas_pendentes':
        await mostrar_vacinas(query, context, cpf, token, "PENDENTE")

    elif query.data == 'alterar_dados':
        await query.edit_message_text(
            "✏️ Envie seus novos dados no formato:\nTelefone,Email\n\nExemplo:\n(47) 99999-9999,email@dominio.com"
        )
        return ALTERAR_DADOS

    elif query.data == 'voltar':
        await enviar_menu(query, context)
        return MENU

    elif query.data == 'sair':
        context.user_data.clear()
        # Apaga o arquivo de login para "deslogar" o usuário
        if os.path.exists(LOGIN_FILE):
            os.remove(LOGIN_FILE)

        await query.edit_message_text(
            "🔒 Você saiu da sessão.\n"
            "Para continuar, faça login no site e envie qualquer mensagem."
        )
        return ConversationHandler.END


async def mostrar_vacinas(query, context, cpf, token, status):
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.get(API_URL_VACINAS, params={"cpf": cpf}, headers=headers)
        if resp.status_code == 200:
            vacinas = resp.json()
            filtradas = [v for v in vacinas if v.get("validacao") == status]
            if filtradas:
                texto = f"💉 Vacinas {status.lower()}:\n"
                for v in filtradas:
                    texto += f"- {v.get('nome_vacina')} ({v.get('tipo_dose')})\n"
            else:
                texto = f"⚠️ Nenhuma vacina com status {status.lower()} encontrada."
        else:
            texto = "❌ Erro ao buscar vacinas."
    except Exception as e:
        texto = f"❌ Erro: {e}"

    await mostrar_opcoes_voltar(query, texto)


async def mostrar_opcoes_voltar(query, texto):
    keyboard = [
        [InlineKeyboardButton("🔙 Voltar ao menu", callback_data='voltar')],
        [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(texto, reply_markup=reply_markup)


async def receber_novos_dados(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = update.message.text.strip()
    usuario = context.user_data.get('usuario', {})
    token = context.user_data.get('token')
    cpf = usuario.get('cpf')

    try:
        telefone, email = texto.split(',')
    except:
        await update.message.reply_text("❌ Formato inválido. Use Telefone,Email")
        return ALTERAR_DADOS

    payload = {"cpf": cpf, "telefone": telefone.strip(), "email": email.strip()}
    headers = {"Authorization": f"Bearer {token}"}

    try:
        resp = requests.put(API_URL_ATUALIZAR_DADOS, json=payload, headers=headers)
        if resp.status_code == 200:
            await update.message.reply_text("✅ Dados atualizados com sucesso!")
        else:
            await update.message.reply_text("❌ Erro ao atualizar dados.")
    except Exception as e:
        await update.message.reply_text(f"❌ Erro: {e}")

    await enviar_menu(update, context)
    return MENU


def main():
    TOKEN = "7947564259:AAHE5xZBYJLaYQIVioJEhDpsA1k4JOCBFsg"  # Substitua pelo token real do seu bot

    app = ApplicationBuilder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[MessageHandler(filters.TEXT & ~filters.COMMAND, qualquer_mensagem)],
        states={
            MENU: [CallbackQueryHandler(menu_handler)],
            ALTERAR_DADOS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_novos_dados)],
        },
        fallbacks=[],
        allow_reentry=True,
    )

    app.add_handler(conv_handler)

    print("Bot rodando...")
    app.run_polling()


if __name__ == "__main__":
    main()
