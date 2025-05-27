import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperacaoSenhaComponent } from './recuperacao-senha.component';

describe('RecuperacaoSenhaComponent', () => {
  let component: RecuperacaoSenhaComponent;
  let fixture: ComponentFixture<RecuperacaoSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperacaoSenhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperacaoSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
