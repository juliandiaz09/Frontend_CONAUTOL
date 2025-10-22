import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css'],
})
export class FlipbookComponent {
  brochureUrl: string = 'assets/Brochure_servicios_CONAUTOL.pdf';
}
