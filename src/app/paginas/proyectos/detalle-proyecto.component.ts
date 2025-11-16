import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // 👈 AÑADIR RouterModule

import { ApiService } from '../../core/services/api.service';
import { ProyectoDetalle } from '../../core/models/data.model';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-proyecto.component.html',
  styleUrls: ['./detalle-proyecto.component.css'],
})
export class DetalleProyectoComponent implements OnInit {
  proyecto: ProyectoDetalle | null = null;
  isLoading = true;

  // 🖼️ Galería
  allImages: string[] = [];
  selectedImage: string | null = null;
  lightboxOpen = false;
  lightboxImage: string | null = null;
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeChatbot();
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.cargarDetalleProyecto(id);
      }
    });
  }

  cargarDetalleProyecto(id: number): void {
    this.isLoading = true;

    this.apiService.getDetalleProyecto(id).subscribe({
      next: (data: ProyectoDetalle) => {
        this.proyecto = data;
        this.buildImagesFromProyecto(data);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar detalle del proyecto', error);
        this.isLoading = false;
      },
    });
  }

  // =====================================================
  // GALERÍA
  // =====================================================

  private buildImagesFromProyecto(proyecto: ProyectoDetalle): void {
    const imagenes: string[] = [];

    // array nuevo
    if (proyecto.imagen_urls?.length) {
      imagenes.push(...proyecto.imagen_urls);
    }

    // compatibilidad con una posible imagen principal previa
    if ((proyecto as any).imagenPrincipalUrl) {
      imagenes.push((proyecto as any).imagenPrincipalUrl);
    }

    this.allImages = Array.from(new Set(imagenes));

    if (this.allImages.length) {
      this.currentImageIndex = 0;
      this.selectedImage = this.allImages[0];
    } else {
      this.currentImageIndex = 0;
      this.selectedImage = null;
    }
  }

  selectImage(img: string): void {
    const idx = this.allImages.indexOf(img);
    if (idx !== -1) {
      this.currentImageIndex = idx;
      this.selectedImage = img;
    }
  }

  openLightbox(img?: string): void {
    if (!this.allImages.length) return;

    if (img) {
      const idx = this.allImages.indexOf(img);
      if (idx !== -1) {
        this.currentImageIndex = idx;
      }
    } else if (this.selectedImage) {
      const idx = this.allImages.indexOf(this.selectedImage);
      if (idx !== -1) {
        this.currentImageIndex = idx;
      }
    }

    this.lightboxImage = this.allImages[this.currentImageIndex];
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    this.lightboxImage = null;
  }

  nextImage(): void {
    if (!this.allImages.length) return;

    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.allImages.length;

    this.updateSelectedFromIndex();
  }

  prevImage(): void {
    if (!this.allImages.length) return;

    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.allImages.length) %
      this.allImages.length;

    this.updateSelectedFromIndex();
  }

  private updateSelectedFromIndex(): void {
    this.lightboxImage = this.allImages[this.currentImageIndex];
    this.selectedImage = this.lightboxImage;
  }

  // =====================================================
  // NAVEGACIÓN CON TECLADO EN LIGHTBOX
  // =====================================================

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevImage();
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
