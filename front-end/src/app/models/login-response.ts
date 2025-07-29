import { Usuario } from './usuario';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  paciente: Usuario;
}