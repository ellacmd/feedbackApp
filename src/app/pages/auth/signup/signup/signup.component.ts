import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormField,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SignupComponent {
  hidePassword = true;
  loading = new BehaviorSubject<boolean>(false);
  error = '';
  usernameControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);
  firstNameControl = new FormControl('', [Validators.required]);
  lastNameControl = new FormControl('', [Validators.required]);

  signupForm = new FormGroup({
    username: this.usernameControl,
    password: this.passwordControl,
    firstName: this.firstNameControl,
    lastName: this.lastNameControl,
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onSignup(): void {
    this.loading.next(true);
    this.error = '';

    this.authService
      .signup(
        this.firstNameControl.value?.toLowerCase() || '',
        this.lastNameControl.value?.toLowerCase() || '',
        this!.usernameControl.value?.toLowerCase() || '',
        this.passwordControl.value?.toLowerCase() || ''
      )
      .pipe(finalize(() => this.loading.next(false)))
      .subscribe({
        next: (response) => {
          this.router.navigate([''], { replaceUrl: true });
          this.authService.setUser(response)
        },
        error: ({ error }: HttpErrorResponse) => {
          this.error = error.message;
        },
      });
  }
}
