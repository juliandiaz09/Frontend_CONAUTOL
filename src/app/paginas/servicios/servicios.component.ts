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
  styleUrls: ['./servicios.component.css'],
})
export class ServiciosComponent implements OnInit {
  // ✅ Ahora viene de la API
  servicios: ServicioResumen[] = [];
  isLoading: boolean = true;

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
        this.servicios = data; // ya vienen mapeados como ServicioResumen
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.isLoading = false;
      },
    });
  }

  // (Opcional) si tienes ruta de detalle de servicio
  verDetalle(id: number): void {
    this.router.navigate(['/servicio', id]);
  }

  // ================= CHATBOT =================

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
