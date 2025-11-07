import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Proyecto } from '../../core/models/proyecto.model';

@Component({
  selector: 'app-modificar-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-proyecto.component.html',
  styleUrl: './modificar-proyecto.component.css'
})
export class ModificarProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;
  proyectoId!: number;

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
      imagen_url: [''],
    });
  }

  ngOnInit(): void {
    this.proyectoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProyecto();
  }

  cargarProyecto(): void {
    this.api.getProyecto(this.proyectoId).subscribe({
      next: (proyecto: Proyecto) => {
        // Formatear fechas para el input date
        const fechaInicio = proyecto.fecha_inicio ? 
          new Date(proyecto.fecha_inicio).toISOString().split('T')[0] : null;
        const fechaFin = proyecto.fecha_fin ? 
          new Date(proyecto.fecha_fin).toISOString().split('T')[0] : null;

        this.proyectoForm.patchValue({
          nombre: proyecto.nombre,
          descripcion: proyecto.descripcion,
          estado: proyecto.estado,
          cliente: proyecto.cliente,
          presupuesto: proyecto.presupuesto,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          imagen_url: proyecto.imagen_url,
        });
      },
      error: (err) => {
        this.error = 'Error al cargar el proyecto';
      },
    });
  }

  onSubmit(): void {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.api.actualizarProyecto(this.proyectoId, this.proyectoForm.value).subscribe({
      next: () => {
        this.router.navigate(['/admin/proyectos']);
      },
      error: (err) => {
        this.error = 'Error al actualizar el proyecto';
        this.isSubmitting = false;
      },
    });
  }
}