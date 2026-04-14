import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageMasterComponent } from './project-stage-master.component';

describe('ProjectStageMasterComponent', () => {
  let component: ProjectStageMasterComponent;
  let fixture: ComponentFixture<ProjectStageMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStageMasterComponent]
    });
    fixture = TestBed.createComponent(ProjectStageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
