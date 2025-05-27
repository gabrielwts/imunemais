import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeiraTelaCadastroComponent } from './primeira-tela-cadastro.component';

describe('PrimeiraTelaCadastroComponent', () => {
  let component: PrimeiraTelaCadastroComponent;
  let fixture: ComponentFixture<PrimeiraTelaCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeiraTelaCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeiraTelaCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
