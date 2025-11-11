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
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-modificar-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-servicio.component.html',
  styleUrl: './modificar-servicio.component.css',
})
export class ModificarServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  servicioId!: number;
  file?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      categoria: [''],
      estado: ['activo', Validators.required], // solo este campo controla el estado
      icono: [''],
      caracteristicas: [[]],
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarServicio();
  }

  cargarServicio(): void {
    this.api.getServicio(this.servicioId).subscribe({
      next: (servicio: Servicio) => {
        this.servicioForm.patchValue({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          categoria: servicio.categoria,
          estado: servicio.activo ? 'activo' : 'inactivo',
          icono: servicio.icono,
          caracteristicas: servicio.caracteristicas || [],
          imagen_url: servicio.imagen_url,
        });
      },
      error: () => {
        this.error = 'Error al cargar el servicio';
      },
    });
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (f) this.file = f;
  }

  onSubmit(): void {
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const v = this.servicioForm.value;

    // Convertir "estado" (string) → "activo" (boolean)
    const servicioData = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria || '',
      activo: v.estado === 'activo', // <-- backend espera bool
      icono: v.icono || '',
      caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
      ...(this.file ? {} : { imagen_url: v.imagen_url || '' }),
    };

    // Enviar multipart/form-data
    const fd = new FormData();
    fd.append('data', JSON.stringify(servicioData));
    if (this.file) {
      fd.append('imagen', this.file);
    }

    this.api.actualizarServicio(this.servicioId, fd).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        console.error('Error al actualizar el servicio', err);
        this.error = err?.error?.error || 'Error al actualizar el servicio';
        this.isSubmitting = false;
      },
    });
  }

  agregarCaracteristica(event: any): void {
    event.preventDefault();
    const input = event.target.previousElementSibling;
    const caracteristica = input.value.trim();

    if (caracteristica) {
      const caracteristicas =
        this.servicioForm.get('caracteristicas')?.value || [];
      caracteristicas.push(caracteristica);
      this.servicioForm.patchValue({ caracteristicas });
      input.value = '';
    }
  }

  eliminarCaracteristica(index: number): void {
    const caracteristicas = [
      ...(this.servicioForm.get('caracteristicas')?.value || []),
    ];
    caracteristicas.splice(index, 1);
    this.servicioForm.patchValue({ caracteristicas });
  }
}
