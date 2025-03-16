import { CanActivateFn, Router } from '@angular/router';
import { User } from '../../types/user';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const user: User = JSON.parse(localStorage.getItem('userData') || '{}');
  const router: Router = inject(Router);

  if (user.token) {
    return true;
  } else {
    return router.createUrlTree(['/auth']);
  }
};
