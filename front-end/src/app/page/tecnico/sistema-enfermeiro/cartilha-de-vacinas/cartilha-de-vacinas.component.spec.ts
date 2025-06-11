import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartilhaDeVacinasComponent } from './cartilha-de-vacinas.component';

describe('CartilhaDeVacinasComponent', () => {
  let component: CartilhaDeVacinasComponent;
  let fixture: ComponentFixture<CartilhaDeVacinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartilhaDeVacinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartilhaDeVacinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
