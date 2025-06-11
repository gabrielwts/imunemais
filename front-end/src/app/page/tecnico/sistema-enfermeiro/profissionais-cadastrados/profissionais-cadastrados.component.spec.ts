import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfissionaisCadastradosComponent } from './profissionais-cadastrados.component';

describe('ProfissionaisCadastradosComponent', () => {
  let component: ProfissionaisCadastradosComponent;
  let fixture: ComponentFixture<ProfissionaisCadastradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfissionaisCadastradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfissionaisCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
