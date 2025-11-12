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
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent implements OnInit {
  proyectos: ProyectoResumen[] = [];
  isLoading: boolean = true;

  // Referencia al contenedor de carrusel en el HTML
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
        // Duplicamos los datos para simular un carrusel más largo
        this.proyectos = [...data, ...data];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.isLoading = false;
      },
    });
  }

  // Función para navegar al detalle (como en image_d6e840.png)
  verDetalle(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }

  // Lógica para el control del carrusel
  scrollProyectos(direction: 'left' | 'right'): void {
    const container = this.proyectosCarrusel.nativeElement;
    if (container) {
      const scrollAmount = 300;
      container.scrollLeft +=
        direction === 'right' ? scrollAmount : -scrollAmount;
    }
  }
  // Estado del chatbot
  isChatbotVisible = false;

  // Función para toggle del chatbot
  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
    
    // Agregar un pequeño delay para asegurar que el DOM se actualizó
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
    // Asegurarse de que el chatbot empiece oculto
    setTimeout(() => {
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotToggle = document.getElementById('chatbot-toggle');
      
      chatbotContainer?.classList.add('chatbot-hidden');
      chatbotToggle?.classList.remove('chatbot-active');
      
      // Agregar event listener al botón
      chatbotToggle?.addEventListener('click', () => {
        this.toggleChatbot();
      });
    }, 100);
  }
}