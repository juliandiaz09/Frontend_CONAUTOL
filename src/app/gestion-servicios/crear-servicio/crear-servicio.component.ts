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

@Component({
  selector: 'app-crear-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-servicio.component.html',
  styleUrl: './crear-servicio.component.css',
})
export class CrearServicioComponent {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  file?: File;


  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      categoria: [''],
      activo: [true],
      icono: [''],
      caracteristicas: [[]],
      imagen_url: [''],
      estado: ['activo', Validators.required],
    });
  }

  onFile(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files && input.files[0];
    if (f) this.file = f;
  }
 // === Reemplaza solo este método ===
onSubmit(): void {
  if (this.servicioForm.invalid) {
    this.servicioForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.error = null;

  const v = this.servicioForm.value;

  // Normaliza campos y asegura array en caracteristicas
  const servicioData = {
    nombre: v.nombre,
    descripcion: v.descripcion,
    categoria: v.categoria || '',
    activo: v.activo ?? true,
    icono: v.icono || '',
    caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
    // NO mandamos imagen_url cuando subimos archivo; el back la generará.
    // Si quieres conservarla cuando no hay archivo, puedes agregarla aquí.
  };

  // Siempre multipart/form-data (para que el back tenga request.form['data'])
  const fd = new FormData();
  fd.append('data', JSON.stringify(servicioData));
  if (this.file) {
    fd.append('imagen', this.file);
  }

  // (debug temporal) ver lo que realmente se envía
  const out: Record<string, any> = {};
   fd.forEach((val, key) => out[key] = val instanceof File ? {name: val.name, size: val.size, type: val.type} : val);
   console.log('FormData ->', out);

  this.api.crearServicio(fd).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.router.navigate(['/admin/servicios']);
    },
    error: (err) => {
      console.error('Error al crear el servicio', err);
      this.error = err?.error?.error || 'Error al crear el servicio';
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
