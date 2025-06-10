import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginEnfermeiroComponent } from './login-enfermeiro.component';

describe('LoginEnfermeiroComponent', () => {
  let component: LoginEnfermeiroComponent;
  let fixture: ComponentFixture<LoginEnfermeiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginEnfermeiroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginEnfermeiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
