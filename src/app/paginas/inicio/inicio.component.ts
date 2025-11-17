import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule  } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 AÑADIR RouterModule AQUÍ
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // 👈 para <iconify-icon>
})
export class InicioComponent implements OnInit {
  @ViewChild('proyectosCarrusel') proyectosCarrusel!: ElementRef;
  @ViewChild('serviciosCarrusel') serviciosCarrusel!: ElementRef; // 👈 nuevo
  imageUrl: string = '';
  imageAboutUs: string = '';

  serviciosDestacados: any[] = [];

  proyectosDestacados: any[] = [];
  cargando = true;

  constructor(private router: Router, private apiService: ApiService,private storage: StorageService) {}

  async ngOnInit(): Promise<void> {
    this.cargarDatos();
    this.initializeChatbot();
      this.imageUrl = await this.storage.getPublicUrl(
      'Imagenes',
      'soluciones-integrales-eds.jpg'    
    );
    this.imageAboutUs = await this.storage.getPublicUrl(
      'Imagenes',
      'about-us-conautol.jpg'    
    );
    console.log("👉 URL AboutUs generada:", this.imageAboutUs);
  }
  
    cargarDatos() {
    this.cargando = true;

    // Proyectos
    this.apiService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectosDestacados = proyectos.slice(0, 6);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.cargando = false;
      },
    });

    // Servicios destacados
    this.apiService.getServicios().subscribe({
      next: (servicios) => {
        // Puedes filtrar por estado, o tomar los primeros 6
        this.serviciosDestacados = (servicios || [])
          .filter((s: any) => s.estado === 'activo')
          .slice(0, 6);
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      },
    });
  }

    scrollServicios(direccion: 'left' | 'right') {
    const elemento = this.serviciosCarrusel.nativeElement;
    const scrollAmount = 300;
    const scrollPos =
      direccion === 'left'
        ? elemento.scrollLeft - scrollAmount
        : elemento.scrollLeft + scrollAmount;

    elemento.scrollTo({
      left: scrollPos,
      behavior: 'smooth',
    });
  }

    verDetalleServicio(id: number) {
    this.router.navigate(['/servicios', id]);
  }



  scrollProyectos(direccion: 'left' | 'right') {
    const elemento = this.proyectosCarrusel.nativeElement;
    const scrollAmount = 300;
    const scrollPos =
      direccion === 'left'
        ? elemento.scrollLeft - scrollAmount
        : elemento.scrollLeft + scrollAmount;

    elemento.scrollTo({
      left: scrollPos,
      behavior: 'smooth',
    });
  }

  verDetalleProyecto(id: number) {
    this.router.navigate(['/proyectos', id]);
  }

  navegarAServicios(): void {
    this.router.navigate(['/servicios']);
  }

  navegarAProyectos(): void {
    this.router.navigate(['/proyectos']);
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

