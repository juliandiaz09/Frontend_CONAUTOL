import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent {
  contactoForm: FormGroup;
  enviado = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.contactoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      company: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.initializeChatbot();
  }

  onSubmit(): void {
    if (this.contactoForm.valid) {
      this.isLoading = true;
      this.apiService.enviarContacto(this.contactoForm.value).subscribe({
        next: (response) => {
          this.enviado = true;
          this.isLoading = false;
          this.contactoForm.reset();
        },
        error: (error) => {
          console.error('Error al enviar el formulario', error);
          this.isLoading = false;
          alert('Error al enviar el mensaje. Por favor, intente nuevamente.');
        },
      });
    }
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
