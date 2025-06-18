import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPacienteComponent } from './consultar-paciente.component';

describe('ConsultarPacienteComponent', () => {
  let component: ConsultarPacienteComponent;
  let fixture: ComponentFixture<ConsultarPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
