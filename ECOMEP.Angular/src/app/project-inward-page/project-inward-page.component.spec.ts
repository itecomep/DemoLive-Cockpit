import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInwardPageComponent } from './project-inward-page.component';

describe('ProjectInwardPageComponent', () => {
  let component: ProjectInwardPageComponent;
  let fixture: ComponentFixture<ProjectInwardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectInwardPageComponent]
    });
    fixture = TestBed.createComponent(ProjectInwardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
