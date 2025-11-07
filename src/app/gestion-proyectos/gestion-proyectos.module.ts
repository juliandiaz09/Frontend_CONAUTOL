import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarProyectosComponent } from './listar-proyectos/listar-proyectos.component';
import { CrearProyectoComponent } from './crear-proyecto/crear-proyecto.component';
import { ModificarProyectoComponent } from './modificar-proyecto/modificar-proyecto.component';
import { gestionProyectosRoutes } from './gestion-proyectos.routing';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(gestionProyectosRoutes),
    ListarProyectosComponent,
    CrearProyectoComponent,
    ModificarProyectoComponent,
  ],
  exports: [RouterModule],
})
export class GestionProyectosModule {}
