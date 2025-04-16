import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConPatientVaccineComponent } from './con-patient-vaccine.component';

describe('ConPatientVaccineComponent', () => {
  let component: ConPatientVaccineComponent;
  let fixture: ComponentFixture<ConPatientVaccineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConPatientVaccineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConPatientVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
