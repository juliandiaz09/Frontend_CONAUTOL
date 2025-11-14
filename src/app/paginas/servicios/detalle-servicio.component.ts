import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css'],
})
export class DetalleServicioComponent implements OnInit {
  servicio: Servicio | null = null;        // 👉 Servicio completo desde la API
  serviciosFiltrados: string[] = [];       // 👉 características filtradas
  filtroActual = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      console.error('No se recibió ID de servicio en la ruta');
      this.isLoading = false;
      return;
    }

    const id = Number(idParam);

    this.apiService.getServicio(id).subscribe({
      next: (servicio: Servicio) => {
        this.servicio = servicio;
        // Usamos las características como “lista de servicios” de antes
        this.serviciosFiltrados = servicio.caracteristicas ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicio', err);
        this.isLoading = false;
      },
    });
  }

  aplicarFiltro(termino: string): void {
    this.filtroActual = termino;

    if (!this.servicio || !this.servicio.caracteristicas) {
      this.serviciosFiltrados = [];
      return;
    }

    this.serviciosFiltrados = this.servicio.caracteristicas.filter((item: string) =>
      item.toLowerCase().includes(termino.toLowerCase())
    );
  }
}
