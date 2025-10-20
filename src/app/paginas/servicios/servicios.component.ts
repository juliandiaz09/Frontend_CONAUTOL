import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
})
export class ServiciosComponent implements OnInit {
  categoriasServicios = [
    {
      id: 1,
      nombre: 'Optimización de Líneas de Producción',
      servicios: [
        'Análisis y mejora de procesos',
        'Integración de sistemas de seguridad',
      ],
    },
    {
      id: 2,
      nombre: 'Automatización Industrial',
      servicios: [
        'Diseño de control de procesos',
        'Integración sensórica',
        'Sistemas de medición y metrología',
        'Programación de PLCs',
        'Sistemas SCADA y HMI',
      ],
    },
    {
      id: 3,
      nombre: 'Tableros Eléctricos',
      servicios: [
        'Gabinetes de distribución',
        'Bancos de condensadores',
        'Tableros de control eléctrico',
        'Centros de control de motores',
        'Consolas de control',
      ],
    },
    {
      id: 4,
      nombre: 'Instalaciones Eléctricas',
      servicios: [
        'Redes eléctricas baja tensión',
        'Motores eléctricos y servomotores',
        'Estructuras metálicas',
      ],
    },
    {
      id: 5,
      nombre: 'Pruebas Eléctricas',
      servicios: [
        'Pruebas de resistencia de aislamiento',
        'Sistemas de puesta a tierra',
        'Termografía',
      ],
    },
    {
      id: 6,
      nombre: 'Mantenimiento',
      servicios: [
        'Mantenimiento de tableros eléctricos',
        'Mantenimiento de motores',
        'Mantenimiento de plantas eléctricas',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
