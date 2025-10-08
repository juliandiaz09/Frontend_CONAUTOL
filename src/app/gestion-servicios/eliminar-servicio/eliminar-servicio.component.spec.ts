import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarServicioComponent } from './eliminar-servicio.component';

describe('EliminarServicioComponent', () => {
  let component: EliminarServicioComponent;
  let fixture: ComponentFixture<EliminarServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminarServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
