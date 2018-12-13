import {TestBed} from '@angular/core/testing';

import {IdpService} from './idp.service';

describe('IdpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdpService = TestBed.get(IdpService);
    expect(service).toBeTruthy();
  });
});
