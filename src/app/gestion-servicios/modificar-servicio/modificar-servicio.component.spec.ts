import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarServicioComponent } from './modificar-servicio.component';

describe('ModificarServicioComponent', () => {
  let component: ModificarServicioComponent;
  let fixture: ComponentFixture<ModificarServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
