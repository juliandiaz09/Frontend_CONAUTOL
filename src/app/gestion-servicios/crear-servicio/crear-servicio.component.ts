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

interface ImagenPreview {
  url: string;
  isNew: boolean;
  file?: File;
  isPrincipal?: boolean;
  seleccionada?: boolean;
}

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
  
  // 🔥 Sistema de imágenes igual que modificar
  imagenesNuevas: File[] = [];
  imagenesPreviews: ImagenPreview[] = [];
  indicePrincipal: number = 0;
  
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
      
      sizeValidFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const isPrimera = this.imagenesPreviews.length === 0 && index === 0;
          this.imagenesPreviews.push({
            url: e.target?.result as string,
            isNew: true,
            file: file,
            isPrincipal: isPrimera
          });
          
          if (isPrimera) {
            this.indicePrincipal = 0;
          }
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
      this.error = 'No puedes eliminar la única imagen del servicio';
      return;
    }
    
    const fileIndex = this.imagenesNuevas.findIndex(f => f === imagen.file);
    if (fileIndex !== -1) {
      this.imagenesNuevas.splice(fileIndex, 1);
    }
    this.imagenesPreviews.splice(index, 1);
    
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
  }

  // 🔥 Calcular tamaño total
  getTotalFileSize(): string {
    const totalBytes = this.imagenesNuevas.reduce((total, file) => total + file.size, 0);
    const mb = totalBytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  }

  // 🔥 Seleccionar/deseleccionar todas
  toggleSeleccionarTodas(seleccionar: boolean): void {
    this.imagenesPreviews.forEach(img => {
      if (!img.isPrincipal) {
        img.seleccionada = seleccionar;
      }
    });
  }

  // 🔥 Obtener número de seleccionadas
  getImagenesSeleccionadas(): number {
    return this.imagenesPreviews.filter(img => img.seleccionada).length;
  }

  // 🔥 Eliminar seleccionadas
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

  // 🔥 Toggle selección individual
  toggleSeleccion(index: number): void {
    if (this.imagenesPreviews[index] && !this.imagenesPreviews[index].isPrincipal) {
      this.imagenesPreviews[index].seleccionada = !this.imagenesPreviews[index].seleccionada;
    }
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
    
    this.imagenesNuevas.forEach((file) => {
      fd.append('imagenes', file);
    });

    console.log('📤 Total de archivos:', this.imagenesNuevas.length);

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