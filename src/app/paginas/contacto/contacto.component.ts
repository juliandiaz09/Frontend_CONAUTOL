// src/app/paginas/contacto/contacto.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactoForm!: FormGroup;
  isLoading = false;
  enviado = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
     this.initializeChatbot();
    // Campos que coinciden con el HTML
    this.contactoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      company: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    // Transformar los datos al formato que espera el backend
    const datosBackend = {
      nombre: `${this.contactoForm.value.firstName} ${this.contactoForm.value.lastName}`,
      email: this.contactoForm.value.email,
      telefono: this.contactoForm.value.phoneNumber,
      mensaje: `Asunto: ${this.contactoForm.value.subject}\n` +
               `Empresa: ${this.contactoForm.value.company || 'No especificada'}\n\n` +
               `${this.contactoForm.value.message}`
    };

    this.apiService.enviarContacto(datosBackend).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.enviado = true;
        this.successMessage = 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.';
        this.contactoForm.reset();
        
        // Resetear el estado después de 5 segundos
        setTimeout(() => {
          this.enviado = false;
          this.successMessage = null;
        }, 5000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = 'Error al enviar el mensaje. Por favor intenta de nuevo.';
        console.error('Error:', error);
      }
    });
  }
    // Estado del chatbot
  isChatbotVisible = false;

  // Función para toggle del chatbot
  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
    
    // Agregar un pequeño delay para asegurar que el DOM se actualizó
    setTimeout(() => {
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotToggle = document.getElementById('chatbot-toggle');
      
      if (this.isChatbotVisible) {
        chatbotContainer?.classList.remove('chatbot-hidden');
        chatbotContainer?.classList.add('chatbot-visible');
        chatbotToggle?.classList.add('chatbot-active');
      } else {
        chatbotContainer?.classList.remove('chatbot-visible');
        chatbotContainer?.classList.add('chatbot-hidden');
        chatbotToggle?.classList.remove('chatbot-active');
      }
    }, 10);
  }

  initializeChatbot() {
    // Asegurarse de que el chatbot empiece oculto
    setTimeout(() => {
      const chatbotContainer = document.getElementById('chatbot-container');
      const chatbotToggle = document.getElementById('chatbot-toggle');
      
      chatbotContainer?.classList.add('chatbot-hidden');
      chatbotToggle?.classList.remove('chatbot-active');
      
      // Agregar event listener al botón
      chatbotToggle?.addEventListener('click', () => {
        this.toggleChatbot();
      });
    }, 100);
  }
}