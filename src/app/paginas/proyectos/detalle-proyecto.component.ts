import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProyectoDetalle } from '../../core/models/data.model';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css'],
})
export class DetalleProyectoComponent implements OnInit {
  proyecto: ProyectoDetalle | undefined;
  isLoading: boolean = true;
  imagenSeleccionada: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.cargarDetalleProyecto(id);
      }
    });
  }

  cargarDetalleProyecto(id: number): void {
    this.isLoading = true;
    this.apiService.getDetalleProyecto(id).subscribe({
      next: (data: ProyectoDetalle) => {
        this.proyecto = data;
        this.imagenSeleccionada = data.imagenPrincipalUrl;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar detalle del proyecto', error);
        this.isLoading = false;
      },
    });
  }

  seleccionarImagen(url: string): void {
    this.imagenSeleccionada = url;
  }

  contactar(): void {
    alert(
      'Acción "Contactar" disparada. Podría redirigir a /contacto o mostrar un modal.'
    );
  }
}