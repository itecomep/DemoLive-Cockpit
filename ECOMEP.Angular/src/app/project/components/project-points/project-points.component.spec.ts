import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPointsComponent } from './project-points.component';

describe('ProjectPointsComponent', () => {
  let component: ProjectPointsComponent;
  let fixture: ComponentFixture<ProjectPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectPointsComponent]
    });
    fixture = TestBed.createComponent(ProjectPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
