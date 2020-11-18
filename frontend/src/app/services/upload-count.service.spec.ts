import { TestBed } from '@angular/core/testing';

import { UploadCountService } from './upload-count.service';

describe('UploadCountService', () => {
  let service: UploadCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
