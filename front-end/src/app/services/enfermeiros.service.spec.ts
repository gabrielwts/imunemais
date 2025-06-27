import { TestBed } from '@angular/core/testing';

import { EnfermeirosService } from './enfermeiros.service';

describe('EnfermeirosService', () => {
  let service: EnfermeirosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnfermeirosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
