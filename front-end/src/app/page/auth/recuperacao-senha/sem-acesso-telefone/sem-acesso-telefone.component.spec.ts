import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemAcessoTelefoneComponent } from './sem-acesso-telefone.component';

describe('SemAcessoTelefoneComponent', () => {
  let component: SemAcessoTelefoneComponent;
  let fixture: ComponentFixture<SemAcessoTelefoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemAcessoTelefoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemAcessoTelefoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
