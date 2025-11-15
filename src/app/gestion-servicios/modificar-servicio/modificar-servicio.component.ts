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

// 👇 Importa JSON de Iconify igual que en crear-servicio
import * as iconData from '@iconify-json/material-symbols/icons.json';

@Component({
  selector: 'app-modificar-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-servicio.component.html',
  styleUrl: './modificar-servicio.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]   // 👈 necesario
})
export class ModificarServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  servicioId!: number;
  file?: File;

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
      imagen_url: [''],
    });
  }

  ngOnInit(): void {

    // 1️⃣ Cargar iconos igual que Crear Servicio
    const data: any = iconData;
    this.icons = Object.keys(data.icons).map(
      name => `material-symbols:${name}`
    );
    this.filteredIcons = this.icons.slice(0, 100);

    // Buscador
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
        this.servicioForm.patchValue({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          categoria: servicio.categoria,
          estado: servicio.activo ? 'activo' : 'inactivo',
          icono: servicio.icono,                     // 👈 muestra icono actual
          caracteristicas: servicio.caracteristicas || [],
          imagen_url: servicio.imagen_url,
        });
      },
      error: () => {
        this.error = 'Error al cargar el servicio';
      },
    });
  }

  // 👇 Igual que Crear Servicio
  selectIcon(icon: string) {
    this.servicioForm.patchValue({ icono: icon });
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

    const servicioData = {
      nombre: v.nombre,
      descripcion: v.descripcion,
      categoria: v.categoria || '',
      activo: v.estado === 'activo',
      icono: v.icono || '',
      caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
      ...(this.file ? {} : { imagen_url: v.imagen_url || '' }),
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(servicioData));
    if (this.file) fd.append('imagen', this.file);

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
}
