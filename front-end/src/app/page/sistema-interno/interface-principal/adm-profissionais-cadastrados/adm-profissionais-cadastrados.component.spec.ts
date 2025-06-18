import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmProfissionaisCadastradosComponent } from './adm-profissionais-cadastrados.component';

describe('AdmProfissionaisCadastradosComponent', () => {
  let component: AdmProfissionaisCadastradosComponent;
  let fixture: ComponentFixture<AdmProfissionaisCadastradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmProfissionaisCadastradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmProfissionaisCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
