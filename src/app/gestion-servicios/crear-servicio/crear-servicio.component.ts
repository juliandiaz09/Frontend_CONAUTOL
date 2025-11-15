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
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 necesario para <iconify-icon>
  templateUrl: './crear-servicio.component.html',
  styleUrl: './crear-servicio.component.css',
})
export class CrearServicioComponent implements OnInit {
  servicioForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  file?: File;

  // aquí guardaremos ids completos: 'material-symbols:home', etc.
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
      icono: [''],          // aquí guardamos el id completo
      caracteristicas: [[]],
      imagen_url: [''],
      estado: ['activo', Validators.required],
    });
  }

  ngOnInit(): void {
    const data: any = iconData;

    // 🔴 ANTES: this.icons = Object.keys(data.icons);
    // ✅ AHORA: ids completos de Iconify
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
    // icon ya viene como 'material-symbols:home'
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
      activo: v.activo ?? true,
      icono: v.icono || '',  // 👈 aquí se va 'material-symbols:home'
      caracteristicas: Array.isArray(v.caracteristicas) ? v.caracteristicas : [],
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(servicioData));
    if (this.file) {
      fd.append('imagen', this.file);
    }

    const out: Record<string, any> = {};
    fd.forEach((val, key) => {
      out[key] =
        val instanceof File
          ? { name: val.name, size: val.size, type: val.type }
          : val;
    });
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
