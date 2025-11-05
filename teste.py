from fastapi import FastAPI, Response
from reportlab.pdfgen import canvas
from io import BytesIO

app = FastAPI()

@app.get("/carteira-vacina/{cpf}")
async def gerar_carteira(cpf: str):
    # Simulação de dados (aqui você vai puxar do banco)
    paciente_nome = "Gabriel Alves"
    vacinas = [
        {"nome": "COVID-19", "data": "10/02/2025", "dose": "1ª Dose"},
        {"nome": "Hepatite B", "data": "15/01/2025", "dose": "Dose Única"},
    ]

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)

    # Cabeçalho
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(150, 800, "Carteira de Vacinação")

    # Dados do paciente
    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, 770, f"Nome: {paciente_nome}")
    pdf.drawString(50, 750, f"CPF: {cpf}")

    # Vacinas
    y = 720
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Vacinas Aplicadas:")
    y -= 20

    pdf.setFont("Helvetica", 11)
    for v in vacinas:
        pdf.drawString(50, y, f"{v['nome']} — {v['dose']} — {v['data']}")
        y -= 18

    pdf.showPage()
    pdf.save()

    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=carteira_{cpf}.pdf"
        }
    )
