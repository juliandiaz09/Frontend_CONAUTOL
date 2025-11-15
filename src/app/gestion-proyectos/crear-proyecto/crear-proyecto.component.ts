import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
  templateUrl: './crear-proyecto.component.html',
  styleUrl: './crear-proyecto.component.css',
})
export class CrearProyectoComponent {
  proyectoForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  file?: File;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      estado: ['activo', Validators.required],
      cliente: ['', Validators.required],
      presupuesto: [null, [Validators.min(0)]],
      fecha_inicio: [null],
      fecha_fin: [null],
      imagen_url: [''],
    });
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (f) this.file = f;
  }

  // === Nuevo método unificado, igual al de servicios ===
  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const v = this.proyectoForm.value;

    // Normalización de los datos antes de enviar
    const proyectoData = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      estado: v.estado || 'activo',
      cliente: v.cliente,
      presupuesto: v.presupuesto ?? 0,
      fecha_inicio: v.fecha_inicio || null,
      fecha_fin: v.fecha_fin || null,
      // No mandamos imagen_url si hay archivo; el back la generará.
    };

    // Enviamos siempre como multipart/form-data para compatibilidad con el back
    const fd = new FormData();
    fd.append('data', JSON.stringify(proyectoData));
    if (this.file) {
      fd.append('imagen', this.file);
    }

    // (Debug opcional) muestra lo que se envía
    const out: Record<string, any> = {};
    fd.forEach((val, key) => 
      out[key] = val instanceof File
        ? { name: val.name, size: val.size, type: val.type }
        : val
    );
    console.log('FormData ->', out);

    this.api.crearProyecto(fd).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/proyectos']);
      },
      error: (err) => {
        console.error('Error al crear el proyecto', err);
        this.error = err?.error?.error || 'Error al crear el proyecto';
        this.isSubmitting = false;
      },
    });
  }
}
