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
      activo: [true],
      icono: [''],
      caracteristicas: [[]],
      imagen_url: [''],
      estado: ['activo', Validators.required],
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
          activo: servicio.activo,
          icono: servicio.icono,
          caracteristicas: servicio.caracteristicas || [],
          imagen_url: servicio.imagen_url,
          estado: servicio.estado || 'activo',
        });
      },
      error: (err) => {
        this.error = 'Error al cargar el servicio';
      },
    });
  }

  onSubmit(): void {
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.servicioForm.value;
    const servicioData = {
      ...formValue,
      caracteristicas: formValue.caracteristicas || [],
    };

    this.api.actualizarServicio(this.servicioId, servicioData).subscribe({
      next: () => {
        this.router.navigate(['/admin/servicios']);
      },
      error: (err) => {
        this.error = 'Error al actualizar el servicio';
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
