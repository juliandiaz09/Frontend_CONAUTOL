import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ServicioResumen } from '../../core/models/data.model';

@Component({
  selector: 'app-listar-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-servicios.component.html',
  styleUrl: './listar-servicios.component.css',
})
export class ListarServiciosComponent implements OnInit {
  servicios: ServicioResumen[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.error = null;
    this.api.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los servicios';
        this.isLoading = false;
      },
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.api.eliminarServicio(id).subscribe({
        next: () => {
          this.servicios = this.servicios.filter((s) => s.id !== id);
        },
        error: (err) => {
          alert('Error al eliminar el servicio');
        },
      });
    }
  }
}
