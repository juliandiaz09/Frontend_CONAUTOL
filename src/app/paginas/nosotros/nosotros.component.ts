import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css'],
})
export class NosotrosComponent {
  valores = [
    {
      titulo: 'Calidad',
      descripcion:
        'Trabajamos con los más altos estándares de calidad en todos nuestros proyectos.',
      icono: 'verified',
    },
    {
      titulo: 'Innovación',
      descripcion:
        'Implementamos las últimas tecnologías y metodologías en soluciones electromecánicas.',
      icono: 'innovation',
    },
    {
      titulo: 'Compromiso',
      descripcion:
        'Nos comprometemos con el éxito de cada proyecto y la satisfacción de nuestros clientes.',
      icono: 'commitment',
    },
  ];

  serviciosPrincipales = [
    'Automatización Industrial',
    'Diseño de Tableros Eléctricos',
    'Mantenimiento Predictivo',
    'Instalaciones Eléctricas',
    'Pruebas y Análisis Eléctricos',
  ];
}
