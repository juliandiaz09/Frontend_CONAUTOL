import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarProyectoComponent } from './modificar-proyecto.component';

describe('ModificarProyectoComponent', () => {
  let component: ModificarProyectoComponent;
  let fixture: ComponentFixture<ModificarProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
