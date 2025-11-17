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
  isPrincipal?: boolean;
  seleccionada?: boolean;
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
  
  // 🔥 Manejo de imágenes simplificado
  imagenesNuevas: File[] = [];
  imagenesAEliminar: string[] = [];
  imagenesPreviews: ImagenPreview[] = [];
  indicePrincipal: number = 0;

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
        const imagenesExistentes = proyecto.imagen_urls || [];
        
        console.log('✅ Imágenes existentes:', imagenesExistentes);
        
        this.indicePrincipal = 0;
        
        this.imagenesPreviews = imagenesExistentes.map((url, index) => ({
          url,
          isNew: false,
          isPrincipal: index === 0
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
      
      const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== newFiles.length) {
        this.error = 'Algunos archivos no son imágenes válidas';
        return;
      }

      const sizeValidFiles = validFiles.filter(file => file.size <= 5 * 1024 * 1024);
      
      if (sizeValidFiles.length !== validFiles.length) {
        this.error = 'Algunas imágenes superan el tamaño máximo de 5MB';
        return;
      }

      this.imagenesNuevas.push(...sizeValidFiles);
      
      sizeValidFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagenesPreviews.push({
            url: e.target?.result as string,
            isNew: true,
            file: file,
            isPrincipal: false
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
    
    if (this.imagenesPreviews.length === 1) {
      this.error = 'No puedes eliminar la única imagen del proyecto';
      return;
    }
    
    if (imagen.isNew) {
      const fileIndex = this.imagenesNuevas.findIndex(f => f === imagen.file);
      if (fileIndex !== -1) {
        this.imagenesNuevas.splice(fileIndex, 1);
      }
      this.imagenesPreviews.splice(index, 1);
    } else {
      if (!this.imagenesAEliminar.includes(imagen.url)) {
        this.imagenesAEliminar.push(imagen.url);
      }
      
      this.imagenesPreviews.splice(index, 1);
    }
    
    if (index === this.indicePrincipal) {
      this.indicePrincipal = 0;
      if (this.imagenesPreviews.length > 0) {
        this.imagenesPreviews[0].isPrincipal = true;
      }
    } else if (index < this.indicePrincipal) {
      this.indicePrincipal--;
    }
  }

  // 🔥 Establecer imagen principal
  establecerComoPrincipal(index: number): void {
    this.imagenesPreviews.forEach(img => img.isPrincipal = false);
    this.imagenesPreviews[index].isPrincipal = true;
    this.indicePrincipal = index;
    
    console.log('📸 Nueva imagen principal (índice):', this.indicePrincipal);
  }

  // 🔥 Calcular tamaño total de nuevas imágenes
  getTotalFileSize(): string {
    const totalBytes = this.imagenesNuevas.reduce((total, file) => total + file.size, 0);
    const mb = totalBytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  }

  // 🔥 Seleccionar/deseleccionar todas (CORREGIDO: recibe boolean directamente)
  toggleSeleccionarTodas(seleccionar: boolean): void {
    this.imagenesPreviews.forEach(img => {
      if (!img.isPrincipal) {
        img.seleccionada = seleccionar;
      }
    });
  }

  // 🔥 Obtener el número de imágenes seleccionadas
  getImagenesSeleccionadas(): number {
    return this.imagenesPreviews.filter(img => img.seleccionada).length;
  }

  // 🔥 Eliminar las imágenes seleccionadas
  eliminarSeleccionadas(): void {
    const indicesAEliminar = this.imagenesPreviews
      .map((img, index) => (img.seleccionada ? index : -1))
      .filter(index => index !== -1);

    if (indicesAEliminar.length === this.imagenesPreviews.length) {
      this.error = 'No puedes eliminar todas las imágenes del proyecto.';
      return;
    }
    
    for (let i = indicesAEliminar.length - 1; i >= 0; i--) {
      this.marcarParaEliminar(indicesAEliminar[i]);
    }
  }

  // 🔥 Alternar la selección de una imagen
  toggleSeleccion(index: number): void {
    if (this.imagenesPreviews[index] && !this.imagenesPreviews[index].isPrincipal) {
      this.imagenesPreviews[index].seleccionada = !this.imagenesPreviews[index].seleccionada;
    }
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
      imagenes_a_eliminar: this.imagenesAEliminar,
      indice_imagen_principal: this.indicePrincipal,
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(proyectoData));
    
    console.log('📤 Enviando nuevas imágenes:', this.imagenesNuevas.length);
    this.imagenesNuevas.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
      fd.append('imagenes', file);
    });

    console.log('🗑️ Imágenes a eliminar:', this.imagenesAEliminar);
    console.log('📸 Índice imagen principal:', this.indicePrincipal);
    console.log('📋 Datos del proyecto:', proyectoData);

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