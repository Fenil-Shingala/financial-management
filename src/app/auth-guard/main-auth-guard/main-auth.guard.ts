import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mainAuthGuard: CanActivateFn = () => {
  const currentLoginUser = localStorage.getItem('loginUser')
    ? JSON.parse(localStorage.getItem('loginUser') || '')
    : null;
  const router = inject(Router);

  if (currentLoginUser) {
    return true;
  } else {
    router.navigate(['/user-module/login']);
    return false;
  }
};
