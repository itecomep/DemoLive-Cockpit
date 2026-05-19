import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTargetPointsComponent } from './project-target-points.component';

describe('ProjectTargetPointsComponent', () => {
  let component: ProjectTargetPointsComponent;
  let fixture: ComponentFixture<ProjectTargetPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTargetPointsComponent]
    });
    fixture = TestBed.createComponent(ProjectTargetPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
