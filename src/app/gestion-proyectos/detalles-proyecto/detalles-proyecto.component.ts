import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../core/models/proyecto.model';

@Component({
  selector: 'app-detalles-proyecto',
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetallesProyectoComponent {
  @Input() proyecto: Proyecto | null = null;
  @Output() cerrar = new EventEmitter<void>();
}