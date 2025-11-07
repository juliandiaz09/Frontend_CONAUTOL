import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProyectoResumen, ServicioResumen } from '../../core/models/data.model';

@Component({
  selector: 'app-panel-inicio',
  templateUrl: './panel-inicio.component.html',
  styleUrl: './panel-inicio.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class PanelInicioComponent implements OnInit {
  loading = false;
  error: string | null = null;
  proyectos: ProyectoResumen[] = [];
  servicios: ServicioResumen[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    // Cargar proyectos
    this.apiService.getProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los proyectos';
        this.loading = false;
        console.error('Error:', error);
      },
    });

    // Cargar servicios
    this.apiService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
      },
      error: (error) => {
        this.error = this.error
          ? this.error + ' y servicios'
          : 'Error al cargar los servicios';
        console.error('Error:', error);
      },
    });
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  eliminarProyecto(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      this.apiService.eliminarProyecto(id).subscribe({
        next: () => {
          this.proyectos = this.proyectos.filter((p) => p.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar el proyecto:', error);
          this.error = 'Error al eliminar el proyecto';
        },
      });
    }
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
      this.apiService.eliminarServicio(id).subscribe({
        next: () => {
          this.servicios = this.servicios.filter((s) => s.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar el servicio:', error);
          this.error = 'Error al eliminar el servicio';
        },
      });
    }
  }
}
