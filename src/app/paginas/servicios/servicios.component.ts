import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
})
export class ServiciosComponent implements OnInit {
  categoriasServicios = [
    {
      id: 1,
      nombre: 'Optimización de Líneas de Producción',
      descripcion: 'Mejoramos la eficiencia y seguridad de sus líneas de producción.',
      icono: 'precision_manufacturing',
      servicios: [
        'Análisis y mejora de procesos',
        'Integración de sistemas de seguridad',
      ],
    },
    {
      id: 2,
      nombre: 'Automatización Industrial',
      descripcion: 'Soluciones de automatización para optimizar sus procesos.',
      icono: 'memory',
      servicios: [
        'Diseño de control de procesos',
        'Integración sensórica',
        'Sistemas de medición y metrología',
        'Programación de PLCs',
        'Sistemas SCADA y HMI',
      ],
    },
    {
      id: 3,
      nombre: 'Tableros Eléctricos',
      descripcion: 'Diseño y construcción de tableros eléctricos a medida.',
      icono: 'electrical_services',
      servicios: [
        'Gabinetes de distribución',
        'Bancos de condensadores',
        'Tableros de control eléctrico',
        'Centros de control de motores',
        'Consolas de control',
      ],
    },
    {
      id: 4,
      nombre: 'Instalaciones Eléctricas',
      descripcion: 'Instalaciones seguras y eficientes para su empresa.',
      icono: 'power',
      servicios: [
        'Redes eléctricas baja tensión',
        'Motores eléctricos y servomotores',
        'Estructuras metálicas',
      ],
    },
    {
      id: 5,
      nombre: 'Pruebas Eléctricas',
      descripcion: 'Verificación y diagnóstico de sus sistemas eléctricos.',
      icono: 'handyman',
      servicios: [
        'Pruebas de resistencia de aislamiento',
        'Sistemas de puesta a tierra',
        'Termografía',
      ],
    },
    {
      id: 6,
      nombre: 'Mantenimiento',
      descripcion: 'Planes de mantenimiento preventivo y correctivo.',
      icono: 'build',
      servicios: [
        'Mantenimiento de tableros eléctricos',
        'Mantenimiento de motores',
        'Mantenimiento de plantas eléctricas',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {
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
