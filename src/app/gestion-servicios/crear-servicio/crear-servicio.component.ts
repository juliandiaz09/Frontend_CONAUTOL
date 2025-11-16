import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';
import * as iconData from '@iconify-json/material-symbols/icons.json';

@Component({
  selector: 'app-crear-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, BackButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './crear-servicio.component.html',
  styleUrl: './crear-servicio.component.css',
})
export class CrearServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  
  // 🔥 Gestión de múltiples imágenes
  files: File[] = [];
  selectedFiles: { name: string; size: number; preview?: string }[] = [];
  
  categoriasDisponibles = [
    'Optimización de Líneas de Producción',
    'Automatización Industrial',
    'Tableros eléctricos',
    'Pruebas eléctricas',
    'Instalación de Redes de Datos',
    'Mantenimiento',
    'Atención a Emergencias'
  ];

  icons: string[] = [];
  filteredIcons: string[] = [];
  iconSearch = new FormControl('');

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
      estado: ['activo', Validators.required],
    });
  }

  ngOnInit(): void {
    const data: any = iconData;
    this.icons = Object.keys(data.icons).map(
      (name: string) => `material-symbols:${name}`
    );

    this.filteredIcons = this.icons.slice(0, 100);

    this.iconSearch.valueChanges.subscribe((value: string | null) => {
      const filterValue = (value || '').toLowerCase();
      this.filteredIcons = this.icons
        .filter((icon) => icon.toLowerCase().includes(filterValue))
        .slice(0, 100);
    });
  }

  selectIcon(icon: string): void {
    this.servicioForm.patchValue({ icono: icon });
  }

  // 🔥 Manejar selección de múltiples archivos
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

      // Validar tamaño (máximo 5MB por archivo)
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
      
      // Resetear el input
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
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const v = this.servicioForm.value;

    const servicioData = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria || '',
      activo: v.activo ?? true,
      icono: v.icono || '',
      caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(servicioData));
    
    // 🔥 Agregar múltiples archivos con el nombre 'imagenes'
    this.files.forEach((file) => {
      fd.append('imagenes', file);
    });

    const out: Record<string, any> = {};
    fd.forEach((val, key) => {
      out[key] =
        val instanceof File
          ? { name: val.name, size: val.size, type: val.type }
          : val;
    });
    console.log('FormData ->', out);
    console.log('Total de archivos:', this.files.length);

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