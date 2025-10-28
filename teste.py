import secrets

def gerar_codigo():
    return f"{secrets.randbelow(10000):04d}"

print(gerar_codigo())