import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmCadastrarVacinaComponent } from './adm-cadastrar-vacina.component';

describe('AdmCadastrarVacinaComponent', () => {
  let component: AdmCadastrarVacinaComponent;
  let fixture: ComponentFixture<AdmCadastrarVacinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmCadastrarVacinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmCadastrarVacinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
