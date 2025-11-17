import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.css'],
})
export class FlipbookComponent implements OnInit {
  
  brochureUrl: string | null = null;
  isChatbotVisible = false;

  constructor(private storageService: StorageService) {}

async ngOnInit() {
  this.isChatbotVisible = false;

  this.brochureUrl = await this.storageService.getPublicUrl(
    'documents','Brochure_servicios_CONAUTOL.pdf'
  );
}


  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }
}
