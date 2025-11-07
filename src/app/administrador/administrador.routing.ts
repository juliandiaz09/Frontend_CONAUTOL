import { Routes } from '@angular/router';
import { PanelInicioComponent } from './panel-inicio/panel-inicio.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

export const administradorRoutes: Routes = [
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full',
  },
  {
    path: 'panel',
    component: PanelInicioComponent,
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
  },
  {
    path: 'proyectos',
    loadChildren: () =>
      import('../gestion-proyectos/gestion-proyectos.module').then(
        (m) => m.GestionProyectosModule
      ),
  },
  {
    path: 'servicios',
    loadChildren: () =>
      import('../gestion-servicios/gestion-servicios.module').then(
        (m) => m.GestionServiciosModule
      ),
  },
];
