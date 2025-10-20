import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Estado para controlar la visibilidad del menú en dispositivos móviles
  isMenuOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Si necesitas inicializar algo, hazlo aquí.
  }

  // Lógica para alternar el menú de hamburguesa
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Lógica para navegar y cerrar el menú
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false; // Cerrar menú después de navegar (útil en móvil)
  }
}
