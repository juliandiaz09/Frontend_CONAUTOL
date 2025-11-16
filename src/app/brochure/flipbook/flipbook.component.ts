import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css'],
})
export class FlipbookComponent implements OnInit {
  brochureUrl: string = 'assets/Brochure_servicios_CONAUTOL.pdf';
  isChatbotVisible = false;

  ngOnInit() {
    // Inicializar el chatbot como oculto
    this.isChatbotVisible = false;
  }

  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }
}
