import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-panel-inicio',
  templateUrl: './panel-inicio.component.html',
  styleUrl: './panel-inicio.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PanelInicioComponent {
  menuItems = [
    {
      title: 'Gestión de Proyectos',
      route: '/admin/proyectos',
      icon: 'folder',
    },
    { title: 'Gestión de Servicios', route: '/admin/servicios', icon: 'build' },
    { title: 'Configuración', route: '/admin/configuracion', icon: 'settings' },
  ];
}
