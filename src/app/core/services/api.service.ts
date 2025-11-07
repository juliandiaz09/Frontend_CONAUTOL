import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Proyecto,
  ProyectoCreate,
  ProyectoUpdate,
} from '../models/proyecto.model';
import {
  Servicio,
  ServicioCreate,
  ServicioUpdate,
} from '../models/servicio.model';
import {
  ProyectoDetalle,
  ProyectoResumen,
  ServicioResumen,
  ContactoForm,
} from '../models/data.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Normalize baseUrl to avoid double slashes
  private baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  // --- LÓGICA PÚBLICA DE PROYECTOS Y SERVICIOS ---

  // Proyectos
  getProyectos(): Observable<ProyectoResumen[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}/api/proyectos`).pipe(
      map((proyectos: Proyecto[]) =>
        proyectos.map((p) => ({
          id: p.id || 0,
          nombre: p.nombre,
          descripcion: p.descripcion || '',
          descripcionCorta: p.descripcion
            ? p.descripcion.substring(0, 100) + '...'
            : '',
          imagenUrl: p.imagen_url || '',
          estado: p.estado || 'activo',
        }))
      ),
      catchError((error: any) => {
        console.error('Error fetching proyectos:', error);
        return throwError(() => error);
      })
    );
  }

  getProyecto(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.baseUrl}/api/proyectos/${id}`).pipe(
      catchError((error: any) => {
        console.error(`Error fetching proyecto ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  getDetalleProyecto(id: number): Observable<ProyectoDetalle> {
    return this.http
      .get<ProyectoDetalle>(`${this.baseUrl}/api/proyectos/${id}/detalle`)
      .pipe(
        catchError((error: any) => {
          console.error(`Error fetching detalle proyecto ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  crearProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http
      .post<Proyecto>(`${this.baseUrl}/api/proyectos`, proyecto)
      .pipe(
        catchError((error: any) => {
          console.error('Error creating proyecto:', error);
          return throwError(() => error);
        })
      );
  }

  actualizarProyecto(
    id: number,
    proyecto: ProyectoUpdate
  ): Observable<Proyecto> {
    return this.http
      .put<Proyecto>(`${this.baseUrl}/api/proyectos/${id}`, proyecto)
      .pipe(
        catchError((error: any) => {
          console.error(`Error updating proyecto ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/proyectos/${id}`).pipe(
      catchError((error: any) => {
        console.error(`Error deleting proyecto ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Servicios
  getServicios(): Observable<ServicioResumen[]> {
    return this.http.get<Servicio[]>(`${this.baseUrl}/api/servicios`).pipe(
      map((servicios: Servicio[]) =>
        servicios.map((s) => ({
          id: s.id || 0,
          nombre: s.nombre,
          descripcion: s.descripcion || '',
          descripcionCorta: s.descripcion
            ? s.descripcion.substring(0, 100) + '...'
            : '',
          imagenUrl: s.imagen_url || '',
          estado: s.estado || 'activo',
        }))
      ),
      catchError((error: any) => {
        console.error('Error fetching servicios:', error);
        return throwError(() => error);
      })
    );
  }

  getServicio(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.baseUrl}/api/servicios/${id}`).pipe(
      catchError((error: any) => {
        console.error(`Error fetching servicio ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  crearServicio(servicio: ServicioCreate): Observable<Servicio> {
    return this.http
      .post<Servicio>(`${this.baseUrl}/api/servicios`, servicio)
      .pipe(
        catchError((error: any) => {
          console.error('Error creating servicio:', error);
          return throwError(() => error);
        })
      );
  }

  actualizarServicio(
    id: number,
    servicio: ServicioUpdate
  ): Observable<Servicio> {
    return this.http
      .put<Servicio>(`${this.baseUrl}/api/servicios/${id}`, servicio)
      .pipe(
        catchError((error: any) => {
          console.error(`Error updating servicio ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/servicios/${id}`).pipe(
      catchError((error: any) => {
        console.error(`Error deleting servicio ${id}:`, error);
        return throwError(() => error);
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
