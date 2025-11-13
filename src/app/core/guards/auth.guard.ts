import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanActivate {
  constructor(private api: ApiService, private router: Router) {}

  canActivate(): boolean {
    if (!this.api.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

