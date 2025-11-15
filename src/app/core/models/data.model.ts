import { Proyecto } from './proyecto.model';

export interface ProyectoDetalle extends Proyecto {
  imagenPrincipalUrl: string;
  galeria?: string[]; // Array de todas las imagen_urls
  detallesTecnicos?: string[];
}

export interface ProyectoResumen {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;

  // 🔥 Array de URLs (obligatorio)
  imagen_urls: string[];

  // 🔥 Computed: primera imagen para compatibilidad
  imagenUrl?: string;

  estado: 'activo' | 'inactivo' | 'completado';
  cliente?: string;
}


export interface Comentario {
  id: number;
  texto: string;
  autor: string;
  fecha: string;
  valoracion: number;
}

export interface ContactoForm {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  asunto?: string;
}

export interface ServicioResumen {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  imagen_url: string;
  imagenUrl: string;
  estado: 'activo' | 'inactivo' | 'completado';
  icono?: string | null;
  categoria?: string | null;
}