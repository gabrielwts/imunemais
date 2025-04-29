import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProfileCardComponent } from './profile-card/profile-card.component';

@Component({
  selector: 'app-connected-home-page',
  standalone: true,
  imports: [ButtonModule, AvatarModule, AvatarGroupModule, ProfileCardComponent],
  templateUrl: './connected-home-page.component.html',
  styleUrl: './connected-home-page.component.scss'
})
export class ConnectedHomePageComponent {
  dadosUsuario: boolean = false;
  mostrarCard () {
    this.dadosUsuario = !this.dadosUsuario;
  }
}
