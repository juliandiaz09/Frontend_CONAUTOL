import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  @ViewChild('proyectosCarrusel') proyectosCarrusel!: ElementRef;

  serviciosDestacados = [
    {
      id: 1,
      nombre: 'Automatización Industrial',
      descripcion: 'Soluciones integrales en automatización de procesos',
      icono: 'settings',
    },
    {
      id: 2,
      nombre: 'Tableros Eléctricos',
      descripcion: 'Diseño y fabricación de tableros de control',
      icono: 'electric_bolt',
    },
    {
      id: 3,
      nombre: 'Mantenimiento',
      descripcion: 'Mantenimiento predictivo y correctivo',
      icono: 'build',
    },
  ];
  proyectosDestacados: any[] = [];
  cargando = true;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.apiService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectosDestacados = proyectos.slice(0, 6);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.cargando = false;
      },
    });
  }

  scrollProyectos(direccion: 'left' | 'right') {
    const elemento = this.proyectosCarrusel.nativeElement;
    const scrollAmount = 300;
    const scrollPos =
      direccion === 'left'
        ? elemento.scrollLeft - scrollAmount
        : elemento.scrollLeft + scrollAmount;

    elemento.scrollTo({
      left: scrollPos,
      behavior: 'smooth',
    });
  }

  verDetalleProyecto(id: number) {
    this.router.navigate(['/proyectos', id]);
  }

  navegarAServicios(): void {
    this.router.navigate(['/servicios']);
  }

  navegarAProyectos(): void {
    this.router.navigate(['/proyectos']);
  }
}
