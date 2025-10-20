import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Proyecto,
  Servicio,
  ContactoForm,
  Comentario,
} from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- LÓGICA PÚBLICA DE PROYECTOS Y SERVICIOS ---

  getProyectos(): Observable<Servicio[]> {
    // MOCK para la vista de listado
    const mockProyectos: Servicio[] = [
      {
        id: 1,
        nombre: 'PRODUCT NAME',
        descripcionCorta: 'INFO',
        imagenUrl: 'https://via.placeholder.com/300',
      },
      {
        id: 2,
        nombre: 'PRODUCT NAME',
        descripcionCorta: 'INFO',
        imagenUrl: 'https://via.placeholder.com/300',
      },
      {
        id: 3,
        nombre: 'PRODUCT NAME',
        descripcionCorta: 'INFO',
        imagenUrl: 'https://via.placeholder.com/300',
      },
      {
        id: 4,
        nombre: 'PRODUCT NAME',
        descripcionCorta: 'INFO',
        imagenUrl: 'https://via.placeholder.com/300',
      },
    ];
    // return this.http.get<Servicio[]>(`${this.baseUrl}/proyectos`); // Real
    return of(mockProyectos);
  }

  getDetalleProyecto(id: number): Observable<Proyecto> {
    // MOCK para la vista de detalle (image_d6e840.png)
    const mockComentarios: Comentario[] = [
      {
        usuario: 'John Doe',
        fecha: 'August 14, 2024',
        texto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      },
      {
        usuario: 'John Doe',
        fecha: 'August 14, 2024',
        texto:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      },
    ];

    const mockRelacionados = [
      {
        id: 101,
        name: 'PRODUCT NAME',
        info: 'INFO',
        imageUrl: 'https://via.placeholder.com/200',
      },
      {
        id: 102,
        name: 'PRODUCT NAME',
        info: 'INFO',
        imageUrl: 'https://via.placeholder.com/200',
      },
      {
        id: 103,
        name: 'PRODUCT NAME',
        info: 'INFO',
        imageUrl: 'https://via.placeholder.com/200',
      },
      {
        id: 104,
        name: 'PRODUCT NAME',
        info: 'INFO',
        imageUrl: 'https://via.placeholder.com/200',
      },
      {
        id: 105,
        name: 'PRODUCT NAME',
        info: 'INFO',
        imageUrl: 'https://via.placeholder.com/200',
      },
    ];

    const mockDetalle: Proyecto = {
      id: id,
      nombre: 'NOMBRE DEL PROYECTO',
      info: 'info',
      precio: 123.0,
      variantes: ['Variante Estándar', 'Variante Premium'],
      descripcion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.',
      imagenPrincipalUrl: 'https://via.placeholder.com/600x400',
      imagenesSecundariasUrl: [
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100',
        'https://via.placeholder.com/100',
      ],
      productosRelacionados: mockRelacionados,
      comentarios: mockComentarios,
    };
    // return this.http.get<Proyecto>(`${this.baseUrl}/proyectos/${id}`); // Real
    return of(mockDetalle);
  }

  // --- LÓGICA DE CONTACTO ---

  enviarContacto(data: ContactoForm): Observable<any> {
    // return this.http.post(`${this.baseUrl}/contacto`, data); // Real

    console.log('Datos de contacto enviados (MOCK):', data);
    // Simulación de una respuesta exitosa del backend (Flask enviando email)
    return of({ success: true });
  }

  // --- LÓGICA DE AUTENTICACIÓN (ADMIN) ---

  // Lógica de login (sin cambios respecto al paso anterior)
  login(credentials: any): Observable<any> {
    // return this.http.post(`${this.baseUrl}/login`, credentials); // Real
    return of({ token: 'mock-jwt-token-12345' }); // MOCK
  }

  // Enviar email de recuperación de contraseña (mock)
  recoverPassword(email: string): Observable<any> {
    console.log('Solicitada recuperación de contraseña para:', email);
    // Simular respuesta exitosa
    return of({ success: true, message: 'Email de recuperación enviado.' });
  }

  // Métodos de token y autenticación (sin cambios)
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}
