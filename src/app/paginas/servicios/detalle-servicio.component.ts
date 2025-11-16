import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-detalle-servicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css'],
})
export class DetalleServicioComponent implements OnInit {
  servicio: Servicio | null = null;
  serviciosFiltrados: string[] = [];
  filtroActual = '';
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
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      console.error('No se recibió ID de servicio en la ruta');
      this.isLoading = false;
      return;
    }

    const id = Number(idParam);

    this.apiService.getServicio(id).subscribe({
      next: (servicio: Servicio) => {
        this.servicio = servicio;

        this.serviciosFiltrados = servicio.caracteristicas ?? [];

        // Galería
        this.buildImagesFromServicio();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicio', err);
        this.isLoading = false;
      },
    });
  }

  aplicarFiltro(termino: string): void {
    this.filtroActual = termino;

    if (!this.servicio || !this.servicio.caracteristicas) {
      this.serviciosFiltrados = [];
      return;
    }

    this.serviciosFiltrados = this.servicio.caracteristicas.filter((item: string) =>
      item.toLowerCase().includes(termino.toLowerCase())
    );
  }

  // =====================================================
  // GALERÍA
  // =====================================================
  private buildImagesFromServicio(): void {
    if (!this.servicio) return;

    const imgs: string[] = [];

    if (this.servicio.imagen_urls?.length) imgs.push(...this.servicio.imagen_urls);
    if (this.servicio.imagenUrl) imgs.push(this.servicio.imagenUrl);
    if (this.servicio.imagen_url) imgs.push(this.servicio.imagen_url);

    this.allImages = Array.from(new Set(imgs));

    this.currentImageIndex = 0;
    this.selectedImage = this.allImages[0] ?? null;
  }

  selectImage(img: string): void {
    const index = this.allImages.indexOf(img);
    if (index !== -1) {
      this.currentImageIndex = index;
      this.selectedImage = img;
    }
  }

  openLightbox(img?: string): void {
    if (!this.allImages.length) return;

    if (img) {
      const idx = this.allImages.indexOf(img);
      if (idx !== -1) this.currentImageIndex = idx;
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
    this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length;
    this.updateSelectedFromIndex();
  }

  prevImage(): void {
    if (!this.allImages.length) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.allImages.length) % this.allImages.length;
    this.updateSelectedFromIndex();
  }

  private updateSelectedFromIndex(): void {
    this.lightboxImage = this.allImages[this.currentImageIndex];
    this.selectedImage = this.lightboxImage;
  }

  // =====================================================
  // NAVEGACIÓN CON TECLADO
  // =====================================================

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      this.nextImage();
    }

    if (event.key === 'ArrowLeft') {
      this.prevImage();
    }
  }
}
