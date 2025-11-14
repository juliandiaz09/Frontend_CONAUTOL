export interface ServicioBase {
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  activo: boolean;
  icono?: string | null;
  caracteristicas?: string[] | null;
  imagen_url?: string | null;
  estado?: 'activo' | 'inactivo';
}

export interface ServicioCreate extends ServicioBase {}

export interface ServicioUpdate {
  nombre?: string;
  descripcion?: string | null;
  precio?: number | null;
  duracion?: string | null;
  categoria?: string | null;
  activo?: boolean | null;
  icono?: string | null;
  caracteristicas?: string[] | null;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  activo?: boolean | null;
  icono?: string | null;
  caracteristicas?: string[] | null;
  imagen_url?: string | null;
  imagenUrl?: string;
  estado: 'activo' | 'inactivo' | 'completado';

}

