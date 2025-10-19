import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/data.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  // Aquí puedes almacenar los proyectos que se mostrarán en la sección "Proyectos"
  proyectosDestacados: Servicio[] = [];
  isLoading: boolean = true;

  // Datos del CEO/Fundador para la sección "Acerca de Nosotros"
  ceoInfo = {
    nombre: 'Daniel Fuentes',
    cargo: 'CEO',
    descripcion:
      'CONAUTOL nace como una empresa tolimense enfocada en la mejora continua y progreso constante, la cual siempre buscará trabajar con el mayor grado de calidad y satisfacción para nuestros clientes, con soluciones integrales que generen un impacto positivo en los procesos productivos, el bienestar de su personal y los costos de su empresa.',
  };

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    // Cargar algunos proyectos para la sección "Nuestros Proyectos"
    this.cargarProyectosDestacados();
  }

  cargarProyectosDestacados(): void {
    this.apiService.getProyectos().subscribe({
      next: (data) => {
        // Tomamos solo 3 o 4 para la vista de inicio
        this.proyectosDestacados = data.slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos destacados', err);
        this.isLoading = false;
      },
    });
  }

  navegarAContacto(): void {
    this.router.navigate(['/contacto']);
  }

  verDetalleProyecto(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }
}
