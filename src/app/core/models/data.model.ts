export interface Comentario {
  usuario: string;
  fecha: string;
  texto: string;
}

export interface Proyecto {
  id: number;
  nombre: string;
  info: string;
  precio: number;
  variantes: string[];
  descripcion: string;
  imagenPrincipalUrl: string;
  imagenesSecundariasUrl: string[];
  // Simularemos productos relacionados con el mismo tipo de objeto simplificado
  productosRelacionados: {
    id: number;
    name: string;
    info: string;
    imageUrl: string;
  }[];
  comentarios: Comentario[];
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcionCorta: string;
  imagenUrl: string;
}

export interface ContactoForm {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  country: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
}
