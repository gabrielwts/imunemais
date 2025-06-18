import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePrincipalComponent } from './interface-principal.component';

describe('InterfacePrincipalComponent', () => {
  let component: InterfacePrincipalComponent;
  let fixture: ComponentFixture<InterfacePrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterfacePrincipalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfacePrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
