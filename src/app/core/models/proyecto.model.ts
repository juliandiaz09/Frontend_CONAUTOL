export interface ProyectoBase {
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo' | 'completado';
  fecha_inicio?: string | null; // ISO date string
  fecha_fin?: string | null; // ISO date string
  presupuesto?: number | null;
  cliente?: string | null;
  imagen_url?: string | null;
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
  imagen_url?: string | null;
}

export interface Proyecto extends ProyectoBase {
  id: number;
  created_at?: string; // ISO date string
  updated_at?: string; // ISO date string
}
