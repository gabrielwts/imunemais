export class AlterarDadosPaciente {
  constructor(
    public cpf?: string,
    public telefone?: string,
    public email?: string,
    public imagem_perfil?: string,
    public profile_photo?: string
  ) {}
}