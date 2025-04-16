import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-connected-home-page',
  imports: [ButtonModule, RouterLink],
  templateUrl: './connected-home-page.component.html',
  styleUrl: './connected-home-page.component.scss'
})
export class ConnectedHomePageComponent {

}
