import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProyectoResumen, ServicioResumen } from '../../core/models/data.model';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-panel-inicio',
  templateUrl: './panel-inicio.component.html',
  styleUrl: './panel-inicio.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
})
export class PanelInicioComponent implements OnInit {
  loading = false;
  error: string | null = null;
  proyectos: ProyectoResumen[] = [];
  servicios: ServicioResumen[] = [];
  isSubmittingProyecto = false;
  isSubmittingServicio = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  navegarA(ruta: string): void {
    this.router.navigate([ruta]);
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

  crearProyecto(proyecto: any): void {
    this.isSubmittingProyecto = true;
    this.apiService.crearProyecto(proyecto).subscribe({
      next: (nuevo) => {
        // 🔥 CORREGIDO: Migrar imagen_url a imagen_urls
        let imagenesArray: string[] = [];
        
        if (nuevo.imagen_url) {
          imagenesArray.push(nuevo.imagen_url);
        }
        
        if (Array.isArray(nuevo.imagen_urls)) {
          imagenesArray = [...imagenesArray, ...nuevo.imagen_urls];
        }
        
        imagenesArray = [...new Set(imagenesArray)];
        
        const resumen: ProyectoResumen = {
          id: nuevo.id,
          nombre: nuevo.nombre,
          descripcion: nuevo.descripcion || '',
          descripcionCorta: nuevo.descripcion
            ? nuevo.descripcion.substring(0, 100) + '...'
            : '',
          imagen_urls: imagenesArray, // 🔥 Array
          imagenUrl: imagenesArray[0] || '', // 🔥 Primera imagen
          estado: nuevo.estado || 'activo',
          cliente: nuevo.cliente || '',
        };
        
        this.proyectos.push(resumen);
        this.isSubmittingProyecto = false;
        this.navegarA('/admin/proyectos/nuevo');
      },
      error: (error) => {
        this.error = 'Error al crear el proyecto';
        this.isSubmittingProyecto = false;
        console.error('Error al crear el proyecto:', error);
      },
    });
  }

  editarProyecto(id: number, proyecto: any): void {
    this.isSubmittingProyecto = true;
    this.apiService.actualizarProyecto(id, proyecto).subscribe({
      next: (actualizado) => {
        // 🔥 CORREGIDO: Migrar imagen_url a imagen_urls
        let imagenesArray: string[] = [];
        
        if (actualizado.imagen_url) {
          imagenesArray.push(actualizado.imagen_url);
        }
        
        if (Array.isArray(actualizado.imagen_urls)) {
          imagenesArray = [...imagenesArray, ...actualizado.imagen_urls];
        }
        
        imagenesArray = [...new Set(imagenesArray)];
        
        const resumen: ProyectoResumen = {
          id: actualizado.id,
          nombre: actualizado.nombre,
          descripcion: actualizado.descripcion || '',
          descripcionCorta: actualizado.descripcion
            ? actualizado.descripcion.substring(0, 100) + '...'
            : '',
          imagen_urls: imagenesArray, // 🔥 Array
          imagenUrl: imagenesArray[0] || '', // 🔥 Primera imagen
          estado: actualizado.estado || 'activo',
          cliente: actualizado.cliente || '',
        };
        
        this.proyectos = this.proyectos.map((p) => (p.id === id ? resumen : p));
        this.isSubmittingProyecto = false;
        this.navegarA('/admin/proyectos/editar/' + proyecto.id);
      },
      error: (error) => {
        this.error = 'Error al editar el proyecto';
        this.isSubmittingProyecto = false;
        console.error('Error al editar el proyecto:', error);
      },
    });
  }

  crearServicio(servicio: any): void {
    this.isSubmittingServicio = true;
    this.apiService.crearServicio(servicio).subscribe({
      next: (nuevo) => {
        const resumen = {
          id: nuevo.id,
          nombre: nuevo.nombre,
          descripcion: nuevo.descripcion || '',
          descripcionCorta: nuevo.descripcion
            ? nuevo.descripcion.substring(0, 100) + '...'
            : '',
          imagen_url: nuevo.imagen_url || '',
          imagenUrl: nuevo.imagen_url || '',
          estado: nuevo.estado || 'activo',
        };
        this.servicios.push(resumen);
        this.isSubmittingServicio = false;
        this.navegarA('/admin/servicios/nuevo');
      },
      error: (error) => {
        this.error = 'Error al crear el servicio';
        this.isSubmittingServicio = false;
        console.error('Error al crear el servicio:', error);
      },
    });
  }

  editarServicio(id: number, servicio: any): void {
    this.isSubmittingServicio = true;
    this.apiService.actualizarServicio(id, servicio).subscribe({
      next: (actualizado) => {
        const resumen = {
          id: actualizado.id,
          nombre: actualizado.nombre,
          descripcion: actualizado.descripcion || '',
          descripcionCorta: actualizado.descripcion
            ? actualizado.descripcion.substring(0, 100) + '...'
            : '',
          imagen_url: actualizado.imagen_url || '',
          imagenUrl: actualizado.imagen_url || '',
          estado: actualizado.estado || 'activo',
        };
        this.servicios = this.servicios.map((s) => (s.id === id ? resumen : s));
        this.isSubmittingServicio = false;
        this.navegarA('/admin/servicios/editar/' + servicio.id);
      },
      error: (error) => {
        this.error = 'Error al editar el servicio';
        this.isSubmittingServicio = false;
        console.error('Error al editar el servicio:', error);
      },
    });
  }

  eliminarProyecto(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      this.apiService.eliminarProyecto(id).subscribe({
        next: () => {
          this.proyectos = this.proyectos.filter((p) => p.id !== id);
          this.cargarDatos();
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
          this.cargarDatos();
        },
        error: (error) => {
          console.error('Error al eliminar el servicio:', error);
          this.error = 'Error al eliminar el servicio';
        },
      });
    }
  }

  
}