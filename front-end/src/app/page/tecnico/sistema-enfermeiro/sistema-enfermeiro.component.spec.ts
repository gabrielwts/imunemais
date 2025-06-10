import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemaEnfermeiroComponent } from './sistema-enfermeiro.component';

describe('SistemaEnfermeiroComponent', () => {
  let component: SistemaEnfermeiroComponent;
  let fixture: ComponentFixture<SistemaEnfermeiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SistemaEnfermeiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SistemaEnfermeiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
