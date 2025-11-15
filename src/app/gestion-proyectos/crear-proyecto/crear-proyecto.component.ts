// crear-proyecto.component.ts
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
  files: File[] = []; // Cambiar de File a File[]
  selectedFiles: { name: string; size: number; preview?: string }[] = []; // Para mostrar preview

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
      // Eliminamos imagen_url ya que ahora manejamos múltiples imágenes
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      
      // Validar tipos de archivo
      const validFiles = newFiles.filter(file => 
        file.type.startsWith('image/')
      );
      
      if (validFiles.length !== newFiles.length) {
        this.error = 'Algunos archivos no son imágenes válidas';
        return;
      }

      // Validar tamaño (ejemplo: máximo 5MB por archivo)
      const sizeValidFiles = validFiles.filter(file => 
        file.size <= 5 * 1024 * 1024
      );
      
      if (sizeValidFiles.length !== validFiles.length) {
        this.error = 'Algunas imágenes superan el tamaño máximo de 5MB';
        return;
      }

      // Agregar a la lista de archivos
      this.files = [...this.files, ...sizeValidFiles];
      
      // Generar previews para las nuevas imágenes
      this.generatePreviews(sizeValidFiles);
      
      // Limpiar error si todo está bien
      this.error = null;
      
      // Resetear el input para permitir seleccionar los mismos archivos otra vez
      input.value = '';
    }
  }

  private generatePreviews(files: File[]): void {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFiles.push({
          name: file.name,
          size: file.size,
          preview: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  getTotalFileSize(): string {
    const totalBytes = this.files.reduce((total, file) => total + file.size, 0);
    const mb = totalBytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.proyectoForm.value;

    // Preparar datos del proyecto
    const proyectoData = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      estado: formValue.estado || 'activo',
      cliente: formValue.cliente,
      presupuesto: formValue.presupuesto ?? 0,
      fecha_inicio: formValue.fecha_inicio || null,
      fecha_fin: formValue.fecha_fin || null,
    };

    // Crear FormData
    const formData = new FormData();
    formData.append('data', JSON.stringify(proyectoData));
    
    // Agregar múltiples archivos
    this.files.forEach((file, index) => {
      formData.append('imagenes', file); // Cambiar de 'imagen' a 'imagenes'
    });

    // Debug opcional
    const debugData: Record<string, any> = {};
    formData.forEach((val, key) => 
      debugData[key] = val instanceof File
        ? { name: val.name, size: val.size, type: val.type }
        : val
    );
    console.log('FormData enviado ->', debugData);
    console.log('Total de archivos:', this.files.length);

    // Llamar al servicio
    this.api.crearProyecto(formData).subscribe({
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