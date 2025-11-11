import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Proyecto } from '../../core/models/proyecto.model';

@Component({
  selector: 'app-modificar-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-proyecto.component.html',
  styleUrl: './modificar-proyecto.component.css',
})
export class ModificarProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  proyectoId!: number;
  file?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      estado: ['activo', Validators.required], // string, el back de proyectos lo espera así
      cliente: ['', Validators.required],
      presupuesto: [null, [Validators.min(0)]],
      fecha_inicio: [null],
      fecha_fin: [null],
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProyecto();
  }

  cargarProyecto(): void {
    this.api.getProyecto(this.proyectoId).subscribe({
      next: (proyecto: Proyecto) => {
        // Formatear a YYYY-MM-DD para inputs date
        const fechaInicio = proyecto.fecha_inicio
          ? new Date(proyecto.fecha_inicio).toISOString().split('T')[0]
          : null;
        const fechaFin = proyecto.fecha_fin
          ? new Date(proyecto.fecha_fin).toISOString().split('T')[0]
          : null;

        this.proyectoForm.patchValue({
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          estado: proyecto.estado || 'activo',
          cliente: proyecto.cliente,
          presupuesto:
            proyecto.presupuesto === null || proyecto.presupuesto === undefined
              ? null
              : proyecto.presupuesto,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          imagen_url: proyecto.imagen_url || '',
        });
      },
      error: () => {
        this.error = 'Error al cargar el proyecto';
      },
    });
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (f) this.file = f;
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const v = this.proyectoForm.value;

    // Normalización antes de enviar
    const proyectoData: any = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      estado: v.estado || 'activo', // string
      cliente: v.cliente,
      presupuesto: v.presupuesto ?? 0, // si viene null, lo mandamos 0 (o quita esta línea si tu back permite null)
      // Convertimos '' a null para fechas si vienen vacías
      fecha_inicio: v.fecha_inicio ? v.fecha_inicio : null,
      fecha_fin: v.fecha_fin ? v.fecha_fin : null,
      // imagen_url solo si NO hay archivo (para conservar o actualizar la URL manual)
      ...(this.file ? {} : { imagen_url: v.imagen_url || '' }),
    };

    // Siempre multipart/form-data (consistencia con crear y servicios)
    const fd = new FormData();
    fd.append('data', JSON.stringify(proyectoData));
    if (this.file) {
      fd.append('imagen', this.file);
    }

    // (debug opcional) ver payload real
    const out: Record<string, any> = {};
    fd.forEach((val, key) => {
      out[key] =
        val instanceof File
          ? { name: val.name, size: val.size, type: val.type }
          : val;
    });
    console.log('FormData ->', out);

    this.api.actualizarProyecto(this.proyectoId, fd).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/proyectos']);
      },
      error: (err) => {
        console.error('Error al actualizar el proyecto', err);
        this.error = err?.error?.error || 'Error al actualizar el proyecto';
        this.isSubmitting = false;
      },
    });
  }
}
