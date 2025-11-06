import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
  // Normalize baseUrl to avoid double slashes
  private baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  // --- LÓGICA PÚBLICA DE PROYECTOS Y SERVICIOS ---

  getProyectos(): Observable<Servicio[]> {
    // Llamada real al backend
    return this.http.get<Servicio[]>(`${this.baseUrl}/api/proyectos`).pipe(
      catchError((err) => {
        console.error('Error fetching proyectos:', err);
        return throwError(() => err);
      })
    );
  }

  getDetalleProyecto(id: number): Observable<Proyecto> {
    // Llamada real al backend
    return this.http.get<Proyecto>(`${this.baseUrl}/api/proyectos/${id}`).pipe(
      catchError((err) => {
        console.error(`Error fetching proyecto ${id}:`, err);
        return throwError(() => err);
      })
    );
  }

  // --- LÓGICA DE CONTACTO ---

  enviarContacto(data: ContactoForm): Observable<any> {
    // Intentar usar el endpoint del backend; si no existe, mantener un fallback mock
    return this.http.post<any>(`${this.baseUrl}/api/contacto`, data).pipe(
      catchError((err) => {
        // Si el backend no implementa /contacto, sólo logueamos y devolvemos mock
        if (err && err.status === 404) {
          console.warn(
            'Contacto endpoint no encontrado en backend, usando fallback mock.'
          );
          console.log('Datos de contacto enviados (MOCK):', data);
          return of({ success: true });
        }
        console.error('Error al enviar contacto:', err);
        return throwError(() => err);
      })
    );
  }

  // --- LÓGICA DE AUTENTICACIÓN (ADMIN) ---

  // Lógica de login (sin cambios respecto al paso anterior)
  login(credentials: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/admin/login`, credentials)
      .pipe(
        map((resp: any) => {
          const token = resp?.data?.access_token || null;
          const user = resp?.data?.user || null;
          if (token) {
            this.setToken(token);
          }
          // Mantener compatibilidad: devolver { token, user }
          return { token, user, raw: resp };
        }),
        catchError((err) => {
          console.error('Error en login:', err);
          return throwError(() => err);
        })
      );
  }

  // Enviar email de recuperación de contraseña (mock)
  recoverPassword(email: string): Observable<any> {
    // Intentar llamar a un endpoint de recuperación (si existe)
    return this.http
      .post<any>(`${this.baseUrl}/api/admin/recover`, { email })
      .pipe(
        catchError((err) => {
          // Fallback al comportamiento mock si no existe
          console.warn(
            'recoverPassword endpoint no disponible, usando fallback mock.'
          );
          console.log('Solicitada recuperación de contraseña para:', email);
          return of({
            success: true,
            message: 'Email de recuperación enviado (mock).',
          });
        })
      );
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
    // Intentar cerrar sesión en backend (si endpoint existe)
    const token = this.getToken();
    if (token) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http
        .post(`${this.baseUrl}/api/admin/logout`, {}, { headers })
        .subscribe({
          next: () => {
            localStorage.removeItem('auth_token');
          },
          error: () => {
            // aunque falle la llamada, removemos el token localmente
            localStorage.removeItem('auth_token');
          },
        });
    } else {
      localStorage.removeItem('auth_token');
    }
  }
}
