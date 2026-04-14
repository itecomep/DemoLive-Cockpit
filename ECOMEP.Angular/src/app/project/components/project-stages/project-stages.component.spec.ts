import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStagesComponent } from './project-stages.component';

describe('ProjectStagesComponent', () => {
  let component: ProjectStagesComponent;
  let fixture: ComponentFixture<ProjectStagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStagesComponent]
    });
    fixture = TestBed.createComponent(ProjectStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
