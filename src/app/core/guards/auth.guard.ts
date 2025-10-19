import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  if (apiService.isLoggedIn()) {
    return true; // Permitir acceso
  } else {
    // Redirigir a la página de login si no está autenticado
    router.navigate(['/login']);
    return false; // Denegar acceso
  }
};
