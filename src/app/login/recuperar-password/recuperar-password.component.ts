import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  form: FormGroup;
  isLoading = false;
  message: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.message = null;
    this.api.recoverPassword(this.form.value.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message = res.message || 'Email enviado, revisa tu bandeja.';
      },
      error: () => {
        this.isLoading = false;
        this.message = 'Error al solicitar recuperación.';
      },
    });
  }
}
