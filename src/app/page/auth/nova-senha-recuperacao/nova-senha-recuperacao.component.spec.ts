import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaSenhaRecuperacaoComponent } from './nova-senha-recuperacao.component';

describe('NovaSenhaRecuperacaoComponent', () => {
  let component: NovaSenhaRecuperacaoComponent;
  let fixture: ComponentFixture<NovaSenhaRecuperacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaSenhaRecuperacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaSenhaRecuperacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
