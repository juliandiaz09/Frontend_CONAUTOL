import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarProyectoComponent } from './actualizar-proyecto.component';

describe('ActualizarProyectoComponent', () => {
  let component: ActualizarProyectoComponent;
  let fixture: ComponentFixture<ActualizarProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
