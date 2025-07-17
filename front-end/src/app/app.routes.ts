import { Routes } from '@angular/router';
import { LoginComponent } from './page/auth/login/login.component';
import { PrimeiraTelaCadastroComponent } from './page/auth/primeira-tela-cadastro/primeira-tela-cadastro.component';
import { SegundaTelaCadastroComponent } from './page/auth/segunda-tela-cadastro/segunda-tela-cadastro.component';
import { HomePageComponent } from './page/principal/home-page/home-page.component';
import { ConnectedHomePageComponent } from './page/principal/connected-home-page/connected-home-page.component';
import { ConPatientProfileComponent } from './page/principal/con-patient-profile/con-patient-profile.component';
import { RecuperacaoSenhaComponent } from './page/auth/recuperacao-senha/recuperacao-senha.component';
import { NovaSenhaRecuperacaoComponent } from './page/auth/nova-senha-recuperacao/nova-senha-recuperacao.component';
import { CodigoValidacaoComponent } from './page/auth/codigo-validacao/codigo-validacao.component';
import { EsqueciMinhaSenhaComponent } from './page/auth/esqueci-minha-senha/esqueci-minha-senha.component';
import { SemAcessoEmailComponent } from './page/auth/recuperacao-senha/sem-acesso-email/sem-acesso-email.component';
import { SemAcessoTelefoneComponent } from './page/auth/recuperacao-senha/sem-acesso-telefone/sem-acesso-telefone.component';
import { InterfacePrincipalComponent } from './page/sistema-interno/interface-principal/interface-principal.component';
import { ConsultarPacienteComponent } from './page/sistema-interno/interface-principal/consultar-paciente/consultar-paciente.component';
import { LoginInternoComponent } from './page/sistema-interno/login-interno/login-interno.component';


export const routes: Routes = [
    //Página inicial
    {
        path: "",
        component: HomePageComponent
    },

    // Telas de autenticação: login, recuperação de senha, cadastro.
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "cadastro",
        component: PrimeiraTelaCadastroComponent
    },
    {
        path: "cadastro/senha",
        component: SegundaTelaCadastroComponent
    },
    {
        path: "esqueceu-senha",
        component: EsqueciMinhaSenhaComponent
    },
    {
        path: "recuperar-senha",
        component: RecuperacaoSenhaComponent
    },
    {
        path: "sem-acesso-email",
        component: SemAcessoEmailComponent
    },
    {
        path: "sem-acesso-telefone",
        component: SemAcessoTelefoneComponent
    },
    {
        path: "codigo-validacao",
        component: CodigoValidacaoComponent
    },
    {
        path: "nova-senha",
        component: NovaSenhaRecuperacaoComponent
    },

    // Telas logadas: Home page logada, aba de perfil e vacina dos pacientes.
    {
        path: "logado",
        component: ConnectedHomePageComponent
    },
    {
        path: "profile",
        component: ConPatientProfileComponent
    },
    
    // Sistema dos adms e enfermeiros
    {
        path: "sistema-interno-professionals", // Sistema inteiro de enfermeiro + ADM
        component: InterfacePrincipalComponent
    },

    // TESTE DESENVOLVIMENTO
    {
        path: "login-sistema-interno",
        component: LoginInternoComponent
    },
    {
        path: "consultarpaciente",
        component: ConsultarPacienteComponent
    }
];
