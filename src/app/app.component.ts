import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { LoginComponent } from './page/auth/login/login.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, ButtonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'imunemais';
}

@NgModule({
  imports: [ButtonModule]
})
export class AppModule { }