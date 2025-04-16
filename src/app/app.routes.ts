import { Routes } from '@angular/router';
import { LoginComponent } from './page/auth/login/login.component';
import { PrimeiraTelaCadastroComponent } from './page/auth/primeira-tela-cadastro/primeira-tela-cadastro.component';
import { SegundaTelaCadastroComponent } from './page/auth/segunda-tela-cadastro/segunda-tela-cadastro.component';
import { HomePageComponent } from './page/principal/home-page/home-page.component';
import { ConnectedHomePageComponent } from './page/principal/connected-home-page/connected-home-page.component';
import { ConPatientProfileComponent } from './page/principal/con-patient-profile/con-patient-profile.component';
import { ConPatientVaccineComponent } from './page/principal/con-patient-vaccine/con-patient-vaccine.component';
import { RecuperacaoSenhaComponent } from './page/auth/recuperacao-senha/recuperacao-senha.component';
import { NovaSenhaRecuperacaoComponent } from './page/auth/nova-senha-recuperacao/nova-senha-recuperacao.component';
import { CodigoValidacaoComponent } from './page/auth/codigo-validacao/codigo-validacao.component';

export const routes: Routes = [
    {
        path: "",
        component: HomePageComponent
    },
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
        path: "logado",
        component: ConnectedHomePageComponent
    },
    {
        path: "teste",
        component: ConPatientProfileComponent
    },
    {
        path: "teste2",
        component: ConPatientVaccineComponent
    },
    {
        path: "recuperar-senha",
        component: RecuperacaoSenhaComponent
    },
    {
        path: "nova-senha",
        component: NovaSenhaRecuperacaoComponent
    },
    {
        path: "codigo-validacao",
        component: CodigoValidacaoComponent
    }
];
