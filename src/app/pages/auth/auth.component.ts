import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from './login/login/login.component';
import { SignupComponent } from './signup/signup/signup.component';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, MatTabsModule, LoginComponent, SignupComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  selectedIndex = 2;
}
