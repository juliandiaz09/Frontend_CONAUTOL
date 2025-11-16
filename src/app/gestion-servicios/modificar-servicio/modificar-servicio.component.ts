import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/servicio.model';

// 👇 Importa JSON de Iconify
import * as iconData from '@iconify-json/material-symbols/icons.json';

interface ImagenPreview {
  url: string;
  isNew: boolean;
  file?: File;
  isPrincipal?: boolean;
  seleccionada?: boolean; // 👈 para marcar/desmarcar
}

@Component({
  selector: 'app-modificar-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-servicio.component.html',
  styleUrl: './modificar-servicio.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModificarServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  servicioId!: number;
  
  categoriasDisponibles = [
    'Optimización de Líneas de Producción',
    'Automatización Industrial',
    'Tableros eléctricos',
    'Pruebas eléctricas',
    'Instalación de Redes de Datos',
    'Mantenimiento',
    'Atención a Emergencias'
  ];

  // 🔥 Manejo de imágenes - IGUAL QUE PROYECTOS
  imagenesNuevas: File[] = [];
  imagenesAEliminar: string[] = [];
  imagenesPreviews: ImagenPreview[] = [];
  indicePrincipal: number = 0;

  // 👇 Para selector de iconos
  icons: string[] = [];
  filteredIcons: string[] = [];
  iconSearch = new FormControl('');

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
      estado: ['activo', Validators.required],
      icono: [''],
      caracteristicas: [[]],
    });
  }

  ngOnInit(): void {
    // 1️⃣ Cargar iconos
    const data: any = iconData;
    this.icons = Object.keys(data.icons).map(
      name => `material-symbols:${name}`
    );
    this.filteredIcons = this.icons.slice(0, 100);

    this.iconSearch.valueChanges.subscribe((value) => {
      const filter = (value || '').toLowerCase();
      this.filteredIcons = this.icons
        .filter(icon => icon.toLowerCase().includes(filter))
        .slice(0, 100);
    });

    // 2️⃣ Cargar datos del servicio
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarServicio();
  }

  cargarServicio(): void {
    this.api.getServicio(this.servicioId).subscribe({
      next: (servicio: Servicio) => {
        console.log('🔍 Servicio recibido:', servicio);
        
        this.servicioForm.patchValue({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          categoria: servicio.categoria,
          estado: servicio.activo ? 'activo' : 'inactivo',
          icono: servicio.icono,
          caracteristicas: servicio.caracteristicas || [],
        });

        // 🔥 Cargar imágenes existentes
        let imagenesExistentes: string[] = [];
        
        if (servicio.imagen_urls) {
          if (typeof servicio.imagen_urls === 'string') {
            try {
              imagenesExistentes = JSON.parse(servicio.imagen_urls);
            } catch {
              imagenesExistentes = [];
            }
          } else if (Array.isArray(servicio.imagen_urls)) {
            imagenesExistentes = servicio.imagen_urls;
          }
        }
        
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
        this.error = 'Error al cargar el servicio';
      },
    });
  }

  // 👇 MÉTODOS PARA GESTIÓN DE IMÁGENES - IGUAL QUE PROYECTOS
  
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

  marcarParaEliminar(index: number): void {
    const imagen = this.imagenesPreviews[index];
    
    if (this.imagenesPreviews.length === 1) {
      this.error = 'No puedes eliminar la única imagen del servicio';
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

  establecerComoPrincipal(index: number): void {
    this.imagenesPreviews.forEach(img => img.isPrincipal = false);
    this.imagenesPreviews[index].isPrincipal = true;
    this.indicePrincipal = index;
    
    console.log('📸 Nueva imagen principal (índice):', this.indicePrincipal);
  }

  getTotalFileSize(): string {
    const totalBytes = this.imagenesNuevas.reduce((total, file) => total + file.size, 0);
    const mb = totalBytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  }

  toggleSeleccionarTodas(seleccionar: boolean): void {
    this.imagenesPreviews.forEach(img => {
      if (!img.isPrincipal) {
        img.seleccionada = seleccionar;
      }
    });
  }

  getImagenesSeleccionadas(): number {
    return this.imagenesPreviews.filter(img => img.seleccionada).length;
  }

  eliminarSeleccionadas(): void {
    const indicesAEliminar = this.imagenesPreviews
      .map((img, index) => (img.seleccionada ? index : -1))
      .filter(index => index !== -1);

    if (indicesAEliminar.length === this.imagenesPreviews.length) {
      this.error = 'No puedes eliminar todas las imágenes del servicio.';
      return;
    }
    
    for (let i = indicesAEliminar.length - 1; i >= 0; i--) {
      this.marcarParaEliminar(indicesAEliminar[i]);
    }
  }

  toggleSeleccion(index: number): void {
    if (this.imagenesPreviews[index] && !this.imagenesPreviews[index].isPrincipal) {
      this.imagenesPreviews[index].seleccionada = !this.imagenesPreviews[index].seleccionada;
    }
  }

  // 👇 Selector de iconos
  selectIcon(icon: string) {
    this.servicioForm.patchValue({ icono: icon });
  }

  // 👇 Gestión de características
  agregarCaracteristica(event: any): void {
    event.preventDefault();
    const input = event.target.previousElementSibling;
    const caracteristica = input.value.trim();

    if (caracteristica) {
      const caracteristicas = this.servicioForm.get('caracteristicas')?.value || [];
      caracteristicas.push(caracteristica);
      this.servicioForm.patchValue({ caracteristicas });
      input.value = '';
    }
  }

  eliminarCaracteristica(index: number): void {
    const caracteristicas = [...(this.servicioForm.get('caracteristicas')?.value || [])];
    caracteristicas.splice(index, 1);
    this.servicioForm.patchValue({ caracteristicas });
  }

  // 👇 SUBMIT - IGUAL QUE PROYECTOS
  onSubmit(): void {
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const v = this.servicioForm.value;

    const servicioData: any = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria || '',
      activo: v.estado === 'activo',
      icono: v.icono || '',
      caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
      imagenes_a_eliminar: this.imagenesAEliminar,
      indice_imagen_principal: this.indicePrincipal,
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(servicioData));
    
    console.log('📤 Enviando nuevas imágenes:', this.imagenesNuevas.length);
    this.imagenesNuevas.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${file.size} bytes)`);
      fd.append('imagenes', file);
    });

    console.log('🗑️ Imágenes a eliminar:', this.imagenesAEliminar);
    console.log('📸 Índice imagen principal:', this.indicePrincipal);
    console.log('📋 Datos del servicio:', servicioData);

    this.api.actualizarServicio(this.servicioId, fd).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        this.isSubmitting = false;
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        console.error('❌ Error al actualizar el servicio', err);
        this.error = err?.error?.error || 'Error al actualizar el servicio';
        this.isSubmitting = false;
      },
    });
  }
}