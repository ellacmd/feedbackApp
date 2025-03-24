import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { BehaviorSubject, finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormField,
    MatInputModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hidePassword = true;
  error = '';
  loading = new BehaviorSubject<boolean>(false);
  demoLoading = new BehaviorSubject<boolean>(false);

  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  readonly errorMessages = {
    usernameRequired: 'Username is required.',
    passwordRequired: 'Password is required.',
  };

  loginForm = new FormGroup({
    username: this.usernameControl,
    password: this.passwordControl,
  });

  private _snackBar = inject(MatSnackBar);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    if (!this.usernameControl.value || !this.passwordControl.value) {
      this.error = 'email or password is empty';
      return;
    }
    this.error = '';

    this.loading.next(true);
    this.authService
      .login(
        this.usernameControl.value.toLowerCase(),
        this.passwordControl.value
      )
      .pipe(finalize(() => this.loading.next(false)))
      .subscribe({
        next: (response) => {
          this.router.navigate([''], { replaceUrl: true });
          this.authService.setUser(response);
        },
        error: ({ error }: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }

  loginWithDemo() {
    this.demoLoading.next(true)
    this.authService
      .login('anon101', '123')
      .pipe(finalize(() => this.demoLoading.next(false)))
      .subscribe({
        next: (response) => {
          this.router.navigate([''], { replaceUrl: true });
          this.authService.setUser(response);
        },
        error: ({ error }: HttpErrorResponse) => {
          this._snackBar.open(error.message, '', {
            duration: 3000,
            panelClass: 'error-toast',
          });
        },
      });
  }
}
