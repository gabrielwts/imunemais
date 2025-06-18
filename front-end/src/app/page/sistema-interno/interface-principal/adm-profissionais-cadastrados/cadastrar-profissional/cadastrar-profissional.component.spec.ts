import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarProfissionalComponent } from './cadastrar-profissional.component';

describe('CadastrarProfissionalComponent', () => {
  let component: CadastrarProfissionalComponent;
  let fixture: ComponentFixture<CadastrarProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
