import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ContactoForm } from '../../core/models/data.model';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent implements OnInit {
  contactoForm!: FormGroup;
  enviando: boolean = false;
  mensajeEstado: string = '';
  claseEstado: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.contactoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{7,15}$')],
      ],
    });
  }

  onSubmit(): void {
    if (this.contactoForm.valid) {
      this.enviando = true;
      this.mensajeEstado = '';

      this.apiService.enviarContacto(this.contactoForm.value).subscribe({
        next: (res) => {
          this.enviando = false;
          this.claseEstado = 'success';
          this.mensajeEstado =
            '¡Mensaje enviado con éxito! Te contactaremos pronto.';
          this.contactoForm.reset();
        },
        error: (err) => {
          this.enviando = false;
          this.claseEstado = 'error';
          this.mensajeEstado =
            'Error al enviar el mensaje. Inténtalo más tarde.';
        },
      });
    } else {
      this.contactoForm.markAllAsTouched();
      this.claseEstado = 'error';
      this.mensajeEstado =
        'Por favor, completa correctamente todos los campos obligatorios.';
    }
  }

  onCancel(): void {
    this.contactoForm.reset();
    this.mensajeEstado = '';
    this.claseEstado = '';
  }
}
