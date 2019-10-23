import { TestBed } from '@angular/core/testing';

import { WebReqInterceptorService } from './web-req-interceptor.service';

describe('WebReqInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebReqInterceptorService = TestBed.get(WebReqInterceptorService);
    expect(service).toBeTruthy();
  });
});
