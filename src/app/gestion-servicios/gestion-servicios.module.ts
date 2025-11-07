import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarServiciosComponent } from './listar-servicios/listar-servicios.component';
import { CrearServicioComponent } from './crear-servicio/crear-servicio.component';
import { ModificarServicioComponent } from './modificar-servicio/modificar-servicio.component';
import { gestionServiciosRoutes } from './gestion-servicios.routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(gestionServiciosRoutes),
    ListarServiciosComponent,
    CrearServicioComponent,
    ModificarServicioComponent,
  ],
  exports: [RouterModule],
})
export class GestionServiciosModule {}
