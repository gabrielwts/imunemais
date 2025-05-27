import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegundaTelaCadastroComponent } from './segunda-tela-cadastro.component';

describe('SegundaTelaCadastroComponent', () => {
  let component: SegundaTelaCadastroComponent;
  let fixture: ComponentFixture<SegundaTelaCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegundaTelaCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegundaTelaCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
