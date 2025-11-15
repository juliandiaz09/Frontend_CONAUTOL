import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Proyecto } from '../../core/models/proyecto.model';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-listar-proyectos',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './listar-proyectos.component.html',
  styleUrl: './listar-proyectos.component.css',
})
export class ListarProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.isLoading = true;
    this.error = null;
    this.api.getProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los proyectos';
        this.isLoading = false;
      },
    });
  }

  eliminarProyecto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      this.api.eliminarProyecto(id).subscribe({
        next: () => {
          this.proyectos = this.proyectos.filter((p) => p.id !== id);
        },
        error: (err) => {
          alert('Error al eliminar el proyecto');
        },
      });
    }
  }
}
