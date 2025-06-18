import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemaInternoComponent } from './sistema-interno.component';

describe('SistemaInternoComponent', () => {
  let component: SistemaInternoComponent;
  let fixture: ComponentFixture<SistemaInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SistemaInternoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SistemaInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
