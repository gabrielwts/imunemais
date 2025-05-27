import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoValidacaoComponent } from './codigo-validacao.component';

describe('CodigoValidacaoComponent', () => {
  let component: CodigoValidacaoComponent;
  let fixture: ComponentFixture<CodigoValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodigoValidacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigoValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
