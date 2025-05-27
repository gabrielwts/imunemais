import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemAcessoEmailComponent } from './sem-acesso-email.component';

describe('SemAcessoEmailComponent', () => {
  let component: SemAcessoEmailComponent;
  let fixture: ComponentFixture<SemAcessoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemAcessoEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemAcessoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
