import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PublicLayoutComponent } from './shared/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', redirectTo: '/inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./paginas/inicio/inicio.component').then(
            (m) => m.InicioComponent
          ),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import('./paginas/servicios/servicios.component').then(
            (m) => m.ServiciosComponent
          ),
      },
      {
        path: 'servicios/:id',
        loadComponent: () =>
          import('./paginas/servicios/detalle-servicio.component').then(
            (m) => m.DetalleServicioComponent
          ),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./paginas/proyectos/proyectos.component').then(
            (m) => m.ProyectosComponent
          ),
      },
      {
        path: 'proyecto/:id',
        loadComponent: () =>
          import('./paginas/proyectos/detalle-proyecto.component').then(
            (m) => m.DetalleProyectoComponent
          ),
      },
      {
        path: 'nosotros',
        loadComponent: () =>
          import('./paginas/nosotros/nosotros.component').then(
            (m) => m.NosotrosComponent
          ),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./paginas/contacto/contacto.component').then(
            (m) => m.ContactoComponent
          ),
      },
      {
        path: 'brochure/flipbook',
        loadComponent: () =>
          import('./brochure/flipbook/flipbook.component').then(
            (m) => m.FlipbookComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login-form/login-form.component').then(
        (m) => m.LoginFormComponent
      ),
  },
  {
    path: 'recuperar-password',
    loadComponent: () =>
      import(
        './login/recuperar-password/recuperar-password.component'
      ).then((m) => m.RecuperarPasswordComponent),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./administrador/administrador.module').then(
        (m) => m.AdministradorModule
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/inicio' },
];