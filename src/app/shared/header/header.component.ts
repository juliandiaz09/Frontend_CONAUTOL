import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuOpen = false;
  logoUrl: string = '';

  constructor(private router: Router,private storage: StorageService) {}

    async ngOnInit() {
    this.logoUrl = await this.storage.getPublicUrl(
      'Imagenes',
      'conautol_logo.png'    
    );
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
