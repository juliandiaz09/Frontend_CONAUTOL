// proyecto.model.ts
export interface ProyectoBase {
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo' | 'completado';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  presupuesto?: number | null;
  cliente?: string | null;
  imagen_urls?: string[]; // 👈 Array de URLs (nuevo)
  imagen_url?: string | null; // 👈 Deprecated - solo para migración
}

export interface ProyectoCreate extends ProyectoBase {}

export interface ProyectoUpdate {
  nombre?: string;
  descripcion?: string | null;
  estado?: 'activo' | 'inactivo' | 'completado';
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  presupuesto?: number | null;
  cliente?: string | null;
  imagen_urls?: string[]; // 👈 Ahora es array
  imagenes_a_eliminar?: string[]; // 👈 NUEVO: URLs a eliminar
}

export interface Proyecto extends ProyectoBase {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// data.model.ts - actualizar ProyectoResumen
export interface ProyectoResumen {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  imagen_urls: string[]; // 👈 Cambiar a array
  imagenUrl?: string; // 👈 Computed: primera imagen
  estado: 'activo' | 'inactivo' | 'completado';
  cliente?: string;
}