import { Usuario } from "../usuario";

export interface AdmLoginResponse {
    access_token: string;
    token_type: string;
    usuario: Usuario;
}
