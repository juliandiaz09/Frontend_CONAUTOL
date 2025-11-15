import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { administradorRoutes } from './administrador.routing';
import { PanelInicioComponent } from './panel-inicio/panel-inicio.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(administradorRoutes),
    PanelInicioComponent,
    ConfiguracionComponent,
    AdminLayoutComponent,
  ],
  exports: [RouterModule],
})
export class AdministradorModule {}
