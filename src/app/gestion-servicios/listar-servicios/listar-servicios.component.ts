import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ServicioResumen } from '../../core/models/data.model';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-listar-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './listar-servicios.component.html',
  styleUrls: ['./listar-servicios.component.css', '../../shared/styles/filters.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 para <iconify-icon>
})
export class ListarServiciosComponent implements OnInit {
  servicios: ServicioResumen[] = [];
  filteredServicios: ServicioResumen[] = [];
  categorias: string[] = [];
  isLoading = false;
  error: string | null = null;

  private searchTerm = '';
  private categoryFilter = '';
  private statusFilter = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.error = null;
    this.api.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.categorias = [...new Set(data.map((s) => s.categoria).filter(Boolean) as string[])];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al cargar los servicios';
        this.isLoading = false;
      },
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.api.eliminarServicio(id).subscribe({
        next: () => {
          this.servicios = this.servicios.filter((s) => s.id !== id);
          this.applyFilters();
        },
        error: () => {
          alert('Error al eliminar el servicio');
        },
      });
    }
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryChange(event: Event): void {
    this.categoryFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onStatusChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredServicios = this.servicios.filter((servicio) => {
      const searchTermMatch = servicio.nombre
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const categoryMatch =
        this.categoryFilter === '' || servicio.categoria === this.categoryFilter;
      const statusMatch =
        this.statusFilter === '' || servicio.estado === this.statusFilter;
      return searchTermMatch && categoryMatch && statusMatch;
    });
  }
}
