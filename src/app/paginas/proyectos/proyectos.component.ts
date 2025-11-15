import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ProyectoResumen } from '../../core/models/data.model';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css', '../../shared/styles/filters.css'],
})
export class ProyectosComponent implements OnInit {
  proyectos: ProyectoResumen[] = [];
  filteredProyectos: ProyectoResumen[] = [];
  isLoading: boolean = true;

  private searchTerm = '';
  private statusFilter = '';

  @ViewChild('proyectosCarrusel') proyectosCarrusel!: ElementRef;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProyectos();
    this.initializeChatbot();
  }

  cargarProyectos(): void {
    this.isLoading = true;
    this.apiService.getProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.isLoading = false;
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onStatusChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProyectos = this.proyectos.filter((proyecto) => {
      const searchTermMatch =
        proyecto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (proyecto.cliente &&
          proyecto.cliente
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()));
      const statusMatch =
        this.statusFilter === '' || proyecto.estado === this.statusFilter;
      return searchTermMatch && statusMatch;
    });
  }

  scrollProyectos(direction: 'left' | 'right'): void {
    const container = this.proyectosCarrusel.nativeElement;
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft +=
        direction === 'right' ? scrollAmount : -scrollAmount;
    }
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
