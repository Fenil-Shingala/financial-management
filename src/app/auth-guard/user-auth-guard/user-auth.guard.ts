import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userAuthGuard: CanActivateFn = () => {
  const forgotPasswordUserData = sessionStorage.getItem('forgotPasswordUser')
    ? JSON.parse(sessionStorage.getItem('forgotPasswordUser') || '')
    : null;
  const router = inject(Router);

  if (forgotPasswordUserData) {
    return true;
  } else {
    router.navigate(['/user-module/login']);
    return false;
  }
};
