import { TestBed } from '@angular/core/testing';

import { ProjectInwardService } from './project-inward.service';

describe('ProjectInwardService', () => {
  let service: ProjectInwardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectInwardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
