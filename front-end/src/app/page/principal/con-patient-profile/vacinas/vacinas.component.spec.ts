import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacinasComponent } from './vacinas.component';

describe('VacinasComponent', () => {
  let component: VacinasComponent;
  let fixture: ComponentFixture<VacinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
