export class AdmAlterarDadosPaciente {
    constructor(
    public cpf?: string,
    public nome_completo?: string,
    public data_nascimento?: string,
    public telefone?: string,
    public email?: string
  ) {}
}