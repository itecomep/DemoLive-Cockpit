import { TestBed } from '@angular/core/testing';

import { ProjectTargetService } from './project-target.service';

describe('ProjectTargetService', () => {
  let service: ProjectTargetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectTargetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
