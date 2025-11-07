import { Routes } from '@angular/router';
import { ListarProyectosComponent } from './listar-proyectos/listar-proyectos.component';
import { CrearProyectoComponent } from './crear-proyecto/crear-proyecto.component';
import { ModificarProyectoComponent } from './modificar-proyecto/modificar-proyecto.component';

export const gestionProyectosRoutes: Routes = [
  {
    path: '',
    component: ListarProyectosComponent,
  },
  {
    path: 'nuevo',
    component: CrearProyectoComponent,
  },
  {
    path: 'editar/:id',
    component: ModificarProyectoComponent,
  },
];
