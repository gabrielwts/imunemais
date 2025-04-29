import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAlterardadosComponent } from './perfil-alterardados.component';

describe('PerfilAlterardadosComponent', () => {
  let component: PerfilAlterardadosComponent;
  let fixture: ComponentFixture<PerfilAlterardadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilAlterardadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilAlterardadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
