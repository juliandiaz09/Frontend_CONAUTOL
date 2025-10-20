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
}
