export interface ServicioBase {
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  activo: boolean;
  icono?: string | null;
  caracteristicas?: string[] | null;
  imagen_url?: string | null; // 👈 Deprecated - mantener para compatibilidad
  imagen_urls?: string[] | null; // 👈 NUEVO: Array de URLs
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
  imagen_urls?: string[] | null; // 👈 NUEVO: Array de URLs
  imagenes_a_eliminar?: string[]; // 👈 NUEVO: URLs a eliminar
  indice_imagen_principal?: number; // 👈 NUEVO: Índice de la imagen principal
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  activo?: boolean | null;
  icono?: string | null;
  caracteristicas?: string[] | null;
  imagen_url?: string | null; // 👈 Deprecated - mantener para compatibilidad
  imagen_urls?: string[] | null; // 👈 NUEVO: Array de URLs
  imagenUrl?: string; // 👈 Computed property (primera imagen)
  estado: 'activo' | 'inactivo' | 'completado';
  created_at?: string;
  updated_at?: string;
}