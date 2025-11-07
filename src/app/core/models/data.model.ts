import { Proyecto } from './proyecto.model';

export interface ProyectoDetalle extends Proyecto {
  imagenPrincipalUrl: string;
  galeria?: string[];
  detallesTecnicos?: string[];
}

export interface ProyectoResumen {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionCorta: string;
  imagenUrl: string;
  estado: 'activo' | 'inactivo' | 'completado';
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
  imagenUrl: string;
  estado: 'activo' | 'inactivo';
}
