import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-detalles-servicio',
  templateUrl: './detalles-servicio.component.html',
  styleUrls: ['./detalles-servicio.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetallesServicioComponent {
  @Input() servicio: Servicio | null = null;
  @Output() cerrar = new EventEmitter<void>();
}