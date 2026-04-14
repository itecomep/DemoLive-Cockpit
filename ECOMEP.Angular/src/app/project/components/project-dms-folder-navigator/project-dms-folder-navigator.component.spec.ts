import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDmsFolderNavigatorComponent } from './project-dms-folder-navigator.component';

describe('ProjectDmsFolderNavigatorComponent', () => {
  let component: ProjectDmsFolderNavigatorComponent;
  let fixture: ComponentFixture<ProjectDmsFolderNavigatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDmsFolderNavigatorComponent]
    });
    fixture = TestBed.createComponent(ProjectDmsFolderNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
