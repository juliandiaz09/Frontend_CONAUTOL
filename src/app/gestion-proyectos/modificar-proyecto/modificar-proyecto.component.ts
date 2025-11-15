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

interface ImagenPreview {
  url: string;
  isNew: boolean;
  file?: File;
}

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
  
  // 🔥 NUEVO: Manejo de imágenes
  imagenesExistentes: string[] = []; // URLs de la BD
  imagenesNuevas: File[] = []; // Archivos nuevos a subir
  imagenesAEliminar: string[] = []; // URLs marcadas para eliminar
  imagenesPreviews: ImagenPreview[] = []; // Para mostrar en UI

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      estado: ['activo', Validators.required],
      cliente: ['', Validators.required],
      presupuesto: [null, [Validators.min(0)]],
      fecha_inicio: [null],
      fecha_fin: [null],
    });
  }

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProyecto();
  }

  cargarProyecto(): void {
    this.api.getProyecto(this.proyectoId).subscribe({
      next: (proyecto: Proyecto) => {
        console.log('🔍 Proyecto recibido:', proyecto);
        console.log('📸 imagen_url:', proyecto.imagen_url);
        console.log('📸 imagen_urls:', proyecto.imagen_urls);
        
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
          presupuesto: proyecto.presupuesto ?? null,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });

        // 🔥 Cargar imágenes existentes
        this.imagenesExistentes = proyecto.imagen_urls || [];
        console.log('✅ Imágenes existentes cargadas:', this.imagenesExistentes);
        
        this.imagenesPreviews = this.imagenesExistentes.map(url => ({
          url,
          isNew: false
        }));
        
        console.log('✅ Previews generados:', this.imagenesPreviews.length);
      },
      error: () => {
        this.error = 'Error al cargar el proyecto';
      },
    });
  }

  // 🔥 Manejar selección de nuevas imágenes
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);
      
      // Validar tipos
      const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== newFiles.length) {
        this.error = 'Algunos archivos no son imágenes válidas';
        return;
      }

      // Validar tamaño (5MB por archivo)
      const sizeValidFiles = validFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (sizeValidFiles.length !== validFiles.length) {
        this.error = 'Algunas imágenes superan el tamaño máximo de 5MB';
        return;
      }

      // Agregar a la lista
      this.imagenesNuevas.push(...sizeValidFiles);
      
      // Generar previews
      sizeValidFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagenesPreviews.push({
            url: e.target?.result as string,
            isNew: true,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
      
      this.error = null;
      input.value = '';
    }
  }

  // 🔥 Marcar imagen para eliminar
  marcarParaEliminar(index: number): void {
    const imagen = this.imagenesPreviews[index];
    
    if (imagen.isNew) {
      // Es una imagen nueva: remover del array de nuevas
      const fileIndex = this.imagenesNuevas.findIndex(f => f === imagen.file);
      if (fileIndex !== -1) {
        this.imagenesNuevas.splice(fileIndex, 1);
      }
      this.imagenesPreviews.splice(index, 1);
    } else {
      // Es una imagen existente: marcar para eliminar
      if (!this.imagenesAEliminar.includes(imagen.url)) {
        this.imagenesAEliminar.push(imagen.url);
      }
      this.imagenesPreviews.splice(index, 1);
    }
  }

  // 🔥 Calcular tamaño total de nuevas imágenes
  getTotalFileSize(): string {
    const totalBytes = this.imagenesNuevas.reduce((total, file) => total + file.size, 0);
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

    const v = this.proyectoForm.value;

    const proyectoData: any = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      estado: v.estado || 'activo',
      cliente: v.cliente,
      presupuesto: v.presupuesto ?? 0,
      fecha_inicio: v.fecha_inicio || null,
      fecha_fin: v.fecha_fin || null,
      imagenes_a_eliminar: this.imagenesAEliminar, // 🔥 URLs a eliminar
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(proyectoData));
    
    // 🔥 Agregar nuevas imágenes
    console.log('📤 Enviando nuevas imágenes:', this.imagenesNuevas.length);
    this.imagenesNuevas.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
      fd.append('imagenes', file);
    });

    // Debug
    console.log('🗑️ Imágenes a eliminar:', this.imagenesAEliminar);
    console.log('📋 Datos del proyecto:', proyectoData);
    
    // Mostrar contenido del FormData
    console.log('📦 FormData contenido:');
    fd.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });

    this.api.actualizarProyecto(this.proyectoId, fd).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        this.isSubmitting = false;
        this.router.navigate(['/admin/proyectos']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar el proyecto', err);
        this.error = err?.error?.error || 'Error al actualizar el proyecto';
        this.isSubmitting = false;
      },
    });
  }
}