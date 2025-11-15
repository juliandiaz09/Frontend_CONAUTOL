import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Proyecto } from '../../core/models/proyecto.model';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-actualizar-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './actualizar-proyecto.component.html',
  styleUrl: './actualizar-proyecto.component.css',
})
export class ActualizarProyectoComponent implements OnInit {
  proyectoForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  proyectoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      cliente: ['', Validators.required],
      estado: ['activo', Validators.required],
      presupuesto: [0, [Validators.min(0)]],
      fecha_inicio: [''],
      fecha_fin: [''],
      imagen_url: [''],
    });
    this.cargarProyecto();
  }

  cargarProyecto(): void {
    this.apiService.getProyecto(this.proyectoId).subscribe({
      next: (proyecto: Proyecto) => {
        this.proyectoForm.patchValue({
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          cliente: proyecto.cliente,
          estado: proyecto.estado,
          presupuesto: proyecto.presupuesto,
          fecha_inicio: proyecto.fecha_inicio,
          fecha_fin: proyecto.fecha_fin,
          imagen_url: proyecto.imagen_url,
        });
      },
      error: (err) => {
        this.error = 'Error al cargar el proyecto';
      },
    });
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) return;
    this.isSubmitting = true;
    this.apiService
      .actualizarProyecto(this.proyectoId, this.proyectoForm.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/admin/proyectos']);
        },
        error: (err) => {
          this.error = 'Error al actualizar el proyecto';
          this.isSubmitting = false;
        },
      });
  }
}
