import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Páginas públicas
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

  // Brochure
  {
    path: 'brochure/flipbook',
    loadComponent: () =>
      import('./brochure/flipbook/flipbook.component').then(
        (m) => m.FlipbookComponent
      ),
  },

  // Login
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

  // Administrador (protegido)
  {
    path: 'admin',
    loadChildren: () =>
      import('./administrador/administrador.module').then(
        (m) => m.AdministradorModule
      ),
    canActivate: [authGuard],
  },

  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '/inicio' },
];
