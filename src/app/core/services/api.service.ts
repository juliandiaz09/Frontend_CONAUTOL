import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

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
  // Normaliza baseUrl para evitar dobles slashes
  private baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(private http: HttpClient) {}

  /** ----------------- Helpers internos ----------------- */

  // Lee el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Construye headers con Authorization si hay token
  private authHeaderOnly(): HttpHeaders | undefined {
    const token = this.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }

  /**
   * Opciones HTTP para JSON (agrega Content-Type) o para FormData (no fija Content-Type).
   * Siempre incluye Authorization si hay token.
   */
  private buildOptions({ isFormData = false }: { isFormData?: boolean } = {}): { headers?: HttpHeaders } {
    const auth = this.authHeaderOnly();
    if (isFormData) {
      // No fijar Content-Type para que el navegador añada el boundary correcto
      return auth ? { headers: auth } : {};
    } else {
      // JSON por defecto
      const base = new HttpHeaders({ 'Content-Type': 'application/json' });
      const headers = auth ? base.set('Authorization', `Bearer ${this.getToken()}`!) : base;
      return { headers };
    }
  }

  /**
   * Convierte un objeto plano a FormData.
   * - Arrays/objetos anidados se serializan con JSON.stringify (salvo File/Blob).
   * - Ignora null/undefined.
   * - Mantiene File/Blob tal cual.
   */
  private toFormData(data: any): FormData {
    const fd = new FormData();
    const append = (key: string, value: any) => {
      if (value === null || value === undefined) return;
      // Permite File/Blob sin stringify
      if (value instanceof Blob || value instanceof File) {
        fd.append(key, value);
        return;
      }
      // Arrays
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (v instanceof Blob || v instanceof File) {
            fd.append(`${key}[${i}]`, v);
          } else if (typeof v === 'object' && v !== null) {
            fd.append(`${key}[${i}]`, JSON.stringify(v));
          } else {
            fd.append(`${key}[${i}]`, String(v));
          }
        });
        return;
      }
      // Objetos
      if (typeof value === 'object') {
        fd.append(key, JSON.stringify(value));
        return;
      }
      // Primitivos
      fd.append(key, String(value));
    };

    if (data && typeof data === 'object' && !(data instanceof FormData)) {
      Object.keys(data).forEach((k) => append(k, (data as any)[k]));
    }
    return fd;
  }

  /** --------------- LÓGICA PÚBLICA DE PROYECTOS Y SERVICIOS --------------- */

getProyectos(): Observable<ProyectoResumen[]> {
  return this.http.get<ProyectoResumen[]>(`${this.baseUrl}/api/proyectos`).pipe(
    map((proyectos: ProyectoResumen[]) =>
      proyectos.map((p): ProyectoResumen => ({
        id: p.id ?? 0,
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        descripcionCorta: p.descripcion
          ? p.descripcion.substring(0, 100) + '...'
          : '',
        // 👇 esta es la obligatoria según la interfaz
        imagen_url: p.imagen_url ?? '',
        // 👇 esta es la “bonita” para usar en otros lados
        imagenUrl: p.imagen_url ?? '',
        estado: p.estado ?? 'activo',
        cliente: p.cliente ?? '',
      }))
    )
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

  /**
   * NOTA: Para compatibilidad con backends que usan multer/archivos,
   * enviamos multipart/form-data por defecto (conversión automática),
   * salvo que ya nos pasen un FormData.
   */
crearProyecto(proyecto: ProyectoCreate | Proyecto | FormData): Observable<Proyecto> {
  const body = proyecto instanceof FormData
    ? proyecto
    : (() => {
        const fd = new FormData();
        fd.append('data', JSON.stringify(proyecto));
        return fd;
      })();

  return this.http
    .post<Proyecto>(`${this.baseUrl}/api/proyectos`, body, this.buildOptions({ isFormData: true }))
    .pipe(
      catchError((error: any) => {
        console.error('Error creating proyecto:', error);
        return throwError(() => error);
      })
    );
}

  actualizarProyecto(id: number, proyecto: ProyectoUpdate | FormData): Observable<Proyecto> {
    const body = proyecto instanceof FormData
      ? proyecto
      : (() => {
          const fd = new FormData();
          fd.append('data', JSON.stringify(proyecto));
          return fd;
        })();

    return this.http
      .put<Proyecto>(`${this.baseUrl}/api/proyectos/${id}`, body, this.buildOptions({ isFormData: true }))
      .pipe(
        catchError((error: any) => {
          console.error(`Error updating proyecto ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  eliminarProyecto(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/api/proyectos/${id}`, this.buildOptions())
      .pipe(
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
        servicios.map<ServicioResumen>((s) => ({
          id: s.id ?? 0,
          nombre: s.nombre,
          descripcion: s.descripcion ?? '',
          descripcionCorta: s.descripcion
            ? s.descripcion.substring(0, 100) + '...'
            : '',
          imagen_url: s.imagen_url ?? '',
          imagenUrl: s.imagen_url ?? '',
          estado:
            s.activo === true
              ? 'activo'
              : s.activo === false
              ? 'inactivo'
              : 'completado',
          icono: s.icono ?? null,
          categoria: s.categoria ?? null,
        }))
      )
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

  /**
   * Crear Servicio: envía multipart/form-data (auto a partir de objeto) o usa el FormData recibido.
   */
  crearServicio(body: FormData) {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    // Usa tu baseUrl real:
    return this.http.post<any>(`${this.baseUrl}/api/servicios`, body, { headers });
  }


  /**
   * Actualizar Servicio: envía multipart/form-data para que el backend reciba campos con multer.
   * Esto corrige el 400 "No se proporcionaron datos" cuando antes se mandaba JSON.
   */
  actualizarServicio(id: number, servicio: ServicioUpdate | FormData): Observable<Servicio> {
    const isFD = servicio instanceof FormData;
    const body = isFD ? (servicio as FormData) : this.toFormData(servicio);
    return this.http
      .put<Servicio>(`${this.baseUrl}/api/servicios/${id}`, body, this.buildOptions({ isFormData: true }))
      .pipe(
        catchError((error: any) => {
          console.error(`Error updating servicio ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/api/servicios/${id}`, this.buildOptions())
      .pipe(
        catchError((error: any) => {
          console.error(`Error deleting servicio ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  /** ------------------------- LÓGICA DE CONTACTO ------------------------- */

  enviarContacto(data: ContactoForm): Observable<any> {
    // Intentar usar el endpoint del backend; si no existe, mantener un fallback mock
    return this.http.post<any>(`${this.baseUrl}/api/contacto`, data, this.buildOptions()).pipe(
      catchError((err) => {
        if (err && err.status === 404) {
          console.warn('Contacto endpoint no encontrado en backend, usando fallback mock.');
          console.log('Datos de contacto enviados (MOCK):', data);
          return of({ success: true });
        }
        console.error('Error al enviar contacto:', err);
        return throwError(() => err);
      })
    );
  }

  /** ---------------- LÓGICA DE AUTENTICACIÓN (ADMIN) ---------------- */

  login(credentials: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/admin/login`, credentials, this.buildOptions())
      .pipe(
        map((resp: any) => {
          const token = resp?.data?.access_token || null;
          const user = resp?.data?.user || null;
          if (token) this.setToken(token);
          return { token, user, raw: resp };
        }),
        catchError((err) => {
          console.error('Error en login:', err);
          return throwError(() => err);
        })
      );
  }

  recoverPassword(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/api/admin/recover`, { email }, this.buildOptions())
      .pipe(
        catchError((err) => {
          console.warn('recoverPassword endpoint no disponible, usando fallback mock.');
          console.log('Solicitada recuperación de contraseña para:', email);
          return of({ success: true, message: 'Email de recuperación enviado (mock).' });
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded?.exp;

      if (!exp) return true; // si por lo que sea no trae exp, lo consideramos válido

      const now = Math.floor(Date.now() / 1000); // en segundos
      if (exp < now) {
        // Token caducado -> limpiar y devolver false
        this.logoutClientSide();
        return false;
      }

      return true;
    } catch (e) {
      // Token inválido -> limpiar y devolver false
      this.logoutClientSide();
      return false;
    }
  }

  /** Logout solo del lado cliente (sin llamar al backend) */
  logoutClientSide(): void {
    localStorage.removeItem('auth_token');
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/api/admin/logout`, {}, this.buildOptions()).subscribe({
      next: () => this.logoutClientSide(),
      error: () => this.logoutClientSide(),
    });
  }

}
