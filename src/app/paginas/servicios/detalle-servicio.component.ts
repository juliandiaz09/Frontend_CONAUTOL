import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css'],
})
export class DetalleServicioComponent implements OnInit {
  categoria: any;
  serviciosFiltrados: string[] = [];
  filtroActual = '';

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoria = this.categoriasServicios.find(c => c.id === +id);
      this.serviciosFiltrados = this.categoria.servicios;
    }
  }

  aplicarFiltro(termino: string): void {
    this.filtroActual = termino;
    this.serviciosFiltrados = this.categoria.servicios.filter((servicio: string) =>
      servicio.toLowerCase().includes(termino.toLowerCase())
    );
  }
}