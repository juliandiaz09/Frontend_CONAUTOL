import { Routes } from '@angular/router';
import { ListarServiciosComponent } from './listar-servicios/listar-servicios.component';
import { CrearServicioComponent } from './crear-servicio/crear-servicio.component';
import { ModificarServicioComponent } from './modificar-servicio/modificar-servicio.component';

export const gestionServiciosRoutes: Routes = [
  {
    path: '',
    component: ListarServiciosComponent,
  },
  {
    path: 'nuevo',
    component: CrearServicioComponent,
  },
  {
    path: 'editar/:id',
    component: ModificarServicioComponent,
  },
];
