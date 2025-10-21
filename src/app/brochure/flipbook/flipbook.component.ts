import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css'],
})
export class FlipbookComponent implements OnInit {
  // La URL del PDF que se va a cargar
  brochureUrl: string = 'assets/Brochure_servicios_CONAUTOL.pdf';

  // Puedes usar una variable para controlar la visualización de carga
  isBrochureLoading: boolean = true;

  constructor() {}

  ngOnInit(): void {
    // Simular el tiempo de carga del PDF o la librería de Flipbook
    setTimeout(() => {
      this.isBrochureLoading = false;
    }, 1500);
  }

  // Método si el usuario quiere descargar el PDF original
  descargarBrochure(): void {
    // Esto crea un enlace de descarga invisible
    const link = document.createElement('a');
    link.href = this.brochureUrl;
    link.download = 'Brochure_CONAUTOL_Servicios.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
