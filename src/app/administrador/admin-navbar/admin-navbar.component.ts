import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class AdminNavbarComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
