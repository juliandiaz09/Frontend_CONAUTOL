import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule } from '@angular/router'; // 👈 AÑADIR RouterModule


@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 IMPORTANTE
})
export class NosotrosComponent {
  valores = [
    {
      titulo: 'Calidad',
      descripcion:
        'Trabajamos con los más altos estándares de calidad en todos nuestros proyectos.',
      icono: 'mdi:shield-check', // ✅ nombre Iconify
    },
    {
      titulo: 'Innovación',
      descripcion:
        'Implementamos las últimas tecnologías y metodologías en soluciones electromecánicas.',
      icono: 'mdi:lightbulb-on-outline', // ✅ ejemplo Iconify
    },
    {
      titulo: 'Compromiso',
      descripcion:
        'Nos comprometemos con el éxito de cada proyecto y la satisfacción de nuestros clientes.',
      icono: 'mdi:handshake', // ✅ ejemplo Iconify
    },
  ];

  serviciosPrincipales = [
    'Automatización Industrial',
    'Diseño de Tableros Eléctricos',
    'Mantenimiento Predictivo',
    'Instalaciones Eléctricas',
    'Pruebas y Análisis Eléctricos',
  ];

    ngOnInit() {
    this.initializeChatbot();
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
