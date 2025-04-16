import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConPatientProfileComponent } from './con-patient-profile.component';

describe('ConPatientProfileComponent', () => {
  let component: ConPatientProfileComponent;
  let fixture: ComponentFixture<ConPatientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConPatientProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConPatientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
