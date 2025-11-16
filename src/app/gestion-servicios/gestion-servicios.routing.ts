import { Routes } from '@angular/router';

export const gestionServiciosRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./listar-servicios/listar-servicios.component').then(
        (m) => m.ListarServiciosComponent
      ),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./crear-servicio/crear-servicio.component').then(
        (m) => m.CrearServicioComponent
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('./modificar-servicio/modificar-servicio.component').then(
        (m) => m.ModificarServicioComponent
      ),
  },
];