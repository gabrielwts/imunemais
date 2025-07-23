from flask import Flask, request, render_template_string
import requests
import json

app = Flask(__name__)

API_URL_LOGIN = "http://127.0.0.1:8000/v1/autenticacao"

LOGIN_HTML = """
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Login ImuneBot</title>
    <style>
        body { font-family: Arial; background: #f0f2f5; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 300px; text-align: center; }
        input { width: 90%; padding: 10px; margin: 10px 0; border-radius: 8px; border: 1px solid #ccc; }
        button { background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
</head>
<body>
<div class="card">
    <h2>Login ImuneBot</h2>
    <form method="post">
        <input type="text" name="cpf" id="cpf" placeholder="CPF" required><br>
        <input type="password" name="senha" placeholder="Senha" required><br>
        <button type="submit">Entrar</button>
    </form>
</div>

<script>
$(document).ready(function(){
    $('#cpf').mask('000.000.000-00');
});
</script>
</body>
</html>
"""

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template_string(LOGIN_HTML)

    cpf = request.form.get('cpf')
    senha = request.form.get('senha')

    payload = {"cpf": cpf, "senha": senha}

    try:
        resp = requests.post(API_URL_LOGIN, json=payload)
        if resp.status_code == 200:
            data = resp.json()
            with open("login_dados.json", "w") as f:
                json.dump(data, f)
            return """
            <h3>✅ Login efetuado com sucesso!</h3>
            <p>Volte ao Telegram e envie qualquer mensagem para continuar.</p>
            """
        else:
            return "<h3>❌ CPF ou senha inválidos. <a href='/login'>Tentar novamente</a></h3>"
    except Exception as e:
        return f"<h3>Erro no servidor: {e}</h3>"

if __name__ == "__main__":
    app.run(port=5000)
