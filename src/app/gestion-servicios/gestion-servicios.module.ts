import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { gestionServiciosRoutes } from './gestion-servicios.routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(gestionServiciosRoutes),
  ],
  exports: [RouterModule],
})
export class GestionServiciosModule {}