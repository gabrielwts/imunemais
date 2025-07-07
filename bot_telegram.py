import logging
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler,
    filters, ContextTypes, ConversationHandler
)

API_URL_LOGIN = "http://127.0.0.1:8000/v1/autenticacao"
API_URL_VACINAS = "http://127.0.0.1:8000/v1/paciente/vacinas"
API_URL_ATUALIZAR_DADOS = "http://127.0.0.1:8000/v1/usuarios/atualizardados"

CPF, SENHA, MENU, ALTERAR_DADOS = range(4)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Olá! Por favor, digite seu CPF:")
    return CPF

async def receber_cpf(update: Update, context: ContextTypes.DEFAULT_TYPE):
    cpf = update.message.text.strip()
    context.user_data['cpf'] = cpf
    await update.message.reply_text("Agora digite sua senha:")
    return SENHA

async def receber_senha(update: Update, context: ContextTypes.DEFAULT_TYPE):
    senha = update.message.text.strip()
    cpf = context.user_data.get('cpf')

    payload = {"cpf": cpf, "senha": senha}

    try:
        response = requests.post(API_URL_LOGIN, json=payload)
        if response.status_code == 200:
            data = response.json()
            nome = data.get("usuario", {}).get("nome")
            if nome:
                context.user_data['usuario'] = data["usuario"]
                await update.message.reply_text(f"Login ok, bem-vindo(a) {nome}!")
                await enviar_menu(update, context)
                return MENU
            else:
                await update.message.reply_text("Erro: resposta inesperada do servidor.")
                return ConversationHandler.END
        else:
            await update.message.reply_text("CPF ou senha inválidos. Digite seu CPF novamente:")
            return CPF
    except Exception as e:
        logger.error(f"Erro na requisição: {e}")
        await update.message.reply_text("Erro de conexão com o servidor. Tente novamente mais tarde.")
        return ConversationHandler.END

async def enviar_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("✅ Ver dados", callback_data='ver_dados')],
        [InlineKeyboardButton("💉 Ver vacinas tomadas", callback_data='ver_vacinas_tomadas')],
        [InlineKeyboardButton("🕒 Ver vacinas pendentes", callback_data='ver_vacinas_pendentes')],
        [InlineKeyboardButton("✏️ Alterar dados", callback_data='alterar_dados')],
        [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    if update.callback_query:
        await update.callback_query.edit_message_text("Escolha uma opção:", reply_markup=reply_markup)
    else:
        await update.message.reply_text("Escolha uma opção:", reply_markup=reply_markup)

async def menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    usuario = context.user_data.get('usuario')
    if not usuario and query.data != 'sair':
        await query.edit_message_text("Sessão expirada, por favor faça login novamente com /start")
        return ConversationHandler.END

    cpf = usuario.get('cpf') if usuario else None

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
            f"Data Nascimento: {data_nascimento}\n\n"
            "🔙 Voltar ao menu"
        )
        keyboard = [
            [InlineKeyboardButton("🔙 Voltar ao menu", callback_data='voltar_menu')],
            [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(texto, reply_markup=reply_markup)

    elif query.data == 'ver_vacinas_tomadas':
        await mostrar_vacinas(update, context, cpf, status_esperado="TOMADA")

    elif query.data == 'ver_vacinas_pendentes':
        await mostrar_vacinas(update, context, cpf, status_esperado="PENDENTE")

    elif query.data == 'alterar_dados':
        await solicitar_alterar_dados(update, context)

    elif query.data == 'voltar_menu':
        await enviar_menu(update, context)

    elif query.data == 'sair':
        context.user_data.clear()
        await query.edit_message_text("Você saiu da sessão. Para entrar novamente, envie /start.")
        return ConversationHandler.END

    else:
        await query.edit_message_text("Opção inválida.")

async def mostrar_vacinas(update: Update, context: ContextTypes.DEFAULT_TYPE, cpf: str, status_esperado: str):
    query = update.callback_query
    try:
        # Requisição para backend para pegar vacinas do usuário
        resp = requests.get(API_URL_VACINAS, params={"cpf": cpf})
        if resp.status_code == 200:
            vacinas = resp.json()
            # Filtrar pela validação: "TOMADA" ou "PENDENTE"
            vacinas_filtradas = [v for v in vacinas if v.get("validacao") == status_esperado]
            if vacinas_filtradas:
                texto = f"💉 Vacinas {status_esperado.lower()}:\n"
                for v in vacinas_filtradas:
                    texto += (
                        f"\n- {v.get('nome_vacina')} ({v.get('tipo_dose')})\n"
                        f"  Descrição: {v.get('descricao_vacina')}\n"
                        f"  Data da dose: {v.get('data_dose_tomada') or 'N/A'}\n"
                    )
            else:
                texto = f"Não há vacinas com status {status_esperado.lower()}."
        else:
            texto = "Erro ao consultar vacinas no servidor."
    except Exception as e:
        logger.error(f"Erro ao buscar vacinas: {e}")
        texto = "Erro na comunicação com o servidor."

    keyboard = [
        [InlineKeyboardButton("🔙 Voltar ao menu", callback_data='voltar_menu')],
        [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(texto, reply_markup=reply_markup)

async def solicitar_alterar_dados(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query

    keyboard = [
        [InlineKeyboardButton("🔙 Voltar ao menu", callback_data='voltar_menu')],
        [InlineKeyboardButton("🔒 Sair", callback_data='sair')]
         ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await query.edit_message_text(
        "✏️ Por favor, envie seus novos dados no formato:\nTelefone,Email\n\nExemplo:\n999999999,meuemail@exemplo.com\n\n"
        "Ou clique em 🔙 Voltar ao menu para cancelar."
    )
    
    # Muda para estado de atualizar dados
    return ALTERAR_DADOS

    

async def receber_novos_dados(update: Update, context: ContextTypes.DEFAULT_TYPE):
    texto = update.message.text.strip()
    cpf = context.user_data.get('cpf')
    partes = texto.split(',')
    if len(partes) != 2:
        await update.message.reply_text("Formato inválido. Envie no formato Telefone,Email.")
        return ALTERAR_DADOS

    telefone, email = partes[0].strip(), partes[1].strip()

    payload = {
        "cpf": cpf,
        "telefone": telefone,
        "email": email
    }

    try:
        resp = requests.put(API_URL_ATUALIZAR_DADOS, json=payload)
        if resp.status_code == 200:
            # Atualiza localmente para mostrar no menu depois
            context.user_data['usuario']['telefone'] = telefone
            context.user_data['usuario']['email'] = email
            await update.message.reply_text("Dados atualizados com sucesso!")
        else:
            await update.message.reply_text("Erro ao atualizar dados no servidor.")
    except Exception as e:
        logger.error(f"Erro ao atualizar dados: {e}")
        await update.message.reply_text("Erro de comunicação com o servidor.")

    await enviar_menu(update, context)
    return MENU

async def cancelar(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Operação cancelada.")
    return ConversationHandler.END

def main():
    TOKEN = "7947564259:AAHE5xZBYJLaYQIVioJEhDpsA1k4JOCBFsg"

    app = ApplicationBuilder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            CPF: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_cpf)],
            SENHA: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_senha)],
            MENU: [CallbackQueryHandler(menu_handler)],
            ALTERAR_DADOS: [MessageHandler(filters.TEXT & ~filters.COMMAND, receber_novos_dados)],
        },
        fallbacks=[CommandHandler('cancel', cancelar)],
    )

    app.add_handler(conv_handler)

    print("Bot rodando...")
    app.run_polling()

if __name__ == "__main__":
    main()
    