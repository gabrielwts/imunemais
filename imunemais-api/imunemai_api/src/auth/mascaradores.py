def mascarar_email(email: str):
    nome, dominio = email.split("@")
    return nome[:2] + "*****@" + dominio

def mascarar_telefone(tel: str):
    return "*****-**" + tel[-2:]