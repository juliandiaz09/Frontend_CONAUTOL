import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BackButtonComponent } from '../../shared/back-button/back-button.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent {
  // Aquí puedes agregar lógica para configuración general del admin
}
