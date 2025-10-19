
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Proyecto, Comentario } from '../../core/models/data.model';

@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css'],
})
export class DetalleProyectoComponent implements OnInit {
  proyecto: Proyecto | undefined;
  isLoading: boolean = true;
  imagenSeleccionada: string = ''; // Imagen mostrada en grande

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id']; // Obtiene el 'id' de la ruta
      if (id) {
        this.cargarDetalleProyecto(id);
      }
    });
  }

  cargarDetalleProyecto(id: number): void {
    this.isLoading = true;
    this.apiService.getDetalleProyecto(id).subscribe({
      next: (data) => {
        this.proyecto = data;
        this.imagenSeleccionada = data.imagenPrincipalUrl;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle del proyecto', err);
        this.isLoading = false;
        // Lógica de manejo de error o 404
      },
    });
  }

  seleccionarImagen(url: string): void {
    this.imagenSeleccionada = url;
  }

  contactar(): void {
    // Implementa aquí la lógica de navegación al formulario de contacto
    alert(
      'Acción "Contactar" disparada. Podría redirigir a /contacto o mostrar un modal.'
    );
  }
}
