import { CanActivateFn, Router } from '@angular/router';
import { AuthResponse, User } from '../../types/user';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async() => {
  const router: Router = inject(Router);
  const authService = inject(AuthService);

  const user = await firstValueFrom(authService.user$);
  // if (user?.token) {
  //   return true;
  // } else {
  //   return router.createUrlTree(['/auth']);
  // }
  return true
};
