import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ServicioResumen } from '../../core/models/data.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css', '../../shared/styles/filters.css'],
})
export class ServiciosComponent implements OnInit {
  servicios: ServicioResumen[] = [];
  filteredServicios: ServicioResumen[] = [];
  categorias: string[] = [];
  isLoading: boolean = true;

  private searchTerm = '';
  private categoryFilter = '';
  private statusFilter = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarServicios();
    this.initializeChatbot();
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.apiService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data;
        this.categorias = [...new Set(data.map((s) => s.categoria).filter(Boolean) as string[])];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.isLoading = false;
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/servicio', id]);
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

  isChatbotVisible = false;

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;

    setTimeout(() => {
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotToggle = document.getElementById('chatbot-toggle');

      if (this.isChatbotVisible) {
        chatbotContainer?.classList.remove('chatbot-hidden');
        chatbotContainer?.classList.add('chatbot-visible');
        chatbotToggle?.classList.add('chatbot-active');
      } else {
        chatbotContainer?.classList.remove('chatbot-visible');
        chatbotContainer?.classList.add('chatbot-hidden');
        chatbotToggle?.classList.remove('chatbot-active');
      }
    }, 10);
  }

  initializeChatbot() {
    setTimeout(() => {
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotToggle = document.getElementById('chatbot-toggle');

      chatbotContainer?.classList.add('chatbot-hidden');
      chatbotToggle?.classList.remove('chatbot-active');

      chatbotToggle?.addEventListener('click', () => {
        this.toggleChatbot();
      });
    }, 100);
  }
}