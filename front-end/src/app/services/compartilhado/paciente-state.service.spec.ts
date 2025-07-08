import { TestBed } from '@angular/core/testing';

import { PacienteStateService } from './paciente-state.service';

describe('PacienteStateService', () => {
  let service: PacienteStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
