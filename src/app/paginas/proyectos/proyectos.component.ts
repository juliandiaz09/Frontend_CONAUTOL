import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/data.model';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  proyectos: Servicio[] = [];
  isLoading: boolean = true;

  // Referencia al contenedor de carrusel en el HTML
  @ViewChild('proyectosCarrusel') proyectosCarrusel!: ElementRef;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.isLoading = true;
    this.apiService.getProyectos().subscribe({
      next: (data) => {
        // Duplicamos los datos para simular un carrusel más largo
        this.proyectos = [...data, ...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.isLoading = false;
      },
    });
  }

  // Función para navegar al detalle (como en image_d6e840.png)
  verDetalle(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }

  // Lógica para el control del carrusel
  scrollProyectos(direction: 'left' | 'right'): void {
    const container = this.proyectosCarrusel.nativeElement;
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft +=
        direction === 'right' ? scrollAmount : -scrollAmount;
    }
  }
}
