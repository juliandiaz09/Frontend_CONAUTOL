import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../core/models/proyecto.model';

@Component({
  selector: 'app-detalles-proyecto',
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetallesProyectoComponent implements OnInit {
  @Input() proyecto: Proyecto | null = null;
  @Output() cerrar = new EventEmitter<void>();

  // Estado del chatbot
  isChatbotVisible = false;

  ngOnInit() {
    // Inicializar el chatbot como oculto
    this.isChatbotVisible = false;
  }

  // Función para toggle del chatbot - VERSIÓN CORREGIDA
  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
  }

  // Función para cerrar los detalles del proyecto
  onCerrar() {
    this.cerrar.emit();
  }
}