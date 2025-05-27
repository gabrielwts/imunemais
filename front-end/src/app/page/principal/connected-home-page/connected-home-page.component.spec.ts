import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedHomePageComponent } from './connected-home-page.component';

describe('ConnectedHomePageComponent', () => {
  let component: ConnectedHomePageComponent;
  let fixture: ComponentFixture<ConnectedHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
