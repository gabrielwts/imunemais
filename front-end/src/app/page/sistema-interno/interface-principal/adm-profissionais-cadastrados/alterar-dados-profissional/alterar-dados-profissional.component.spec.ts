import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarDadosProfissionalComponent } from './alterar-dados-profissional.component';

describe('AlterarDadosProfissionalComponent', () => {
  let component: AlterarDadosProfissionalComponent;
  let fixture: ComponentFixture<AlterarDadosProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlterarDadosProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlterarDadosProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
