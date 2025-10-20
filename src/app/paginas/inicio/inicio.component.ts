import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  serviciosDestacados = [
    {
      id: 1,
      nombre: 'Automatización Industrial',
      descripcion: 'Soluciones integrales en automatización de procesos',
      icono: 'settings',
    },
    {
      id: 2,
      nombre: 'Tableros Eléctricos',
      descripcion: 'Diseño y fabricación de tableros de control',
      icono: 'electric_bolt',
    },
    {
      id: 3,
      nombre: 'Mantenimiento',
      descripcion: 'Mantenimiento predictivo y correctivo',
      icono: 'build',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navegarAServicios(): void {
    this.router.navigate(['/servicios']);
  }

  navegarAProyectos(): void {
    this.router.navigate(['/proyectos']);
  }
}
