import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/servicio.model';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-actualizar-servicio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './actualizar-servicio.component.html',
  styleUrl: './actualizar-servicio.component.css',
})
export class ActualizarServicioComponent implements OnInit {
  servicioForm!: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  servicioId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id'));
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
    this.cargarServicio();
  }

  cargarServicio(): void {
    this.apiService.getServicio(this.servicioId).subscribe({
      next: (servicio: Servicio) => {
        this.servicioForm.patchValue({
          nombre: servicio.nombre,
          descripcion: servicio.descripcion,
          categoria: servicio.categoria,
          activo: servicio.activo,
          icono: servicio.icono,
          caracteristicas: servicio.caracteristicas,
          imagen_url: servicio.imagen_url,
          estado: servicio.estado,
        });
      },
      error: (err) => {
        this.error = 'Error al cargar el servicio';
      },
    });
  }

  onSubmit(): void {
    if (this.servicioForm.invalid) return;
    this.isSubmitting = true;
    this.apiService
      .actualizarServicio(this.servicioId, this.servicioForm.value)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
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