import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDmsFolderCreateComponent } from './project-dms-folder-create.component';

describe('ProjectDmsFolderCreateComponent', () => {
  let component: ProjectDmsFolderCreateComponent;
  let fixture: ComponentFixture<ProjectDmsFolderCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDmsFolderCreateComponent]
    });
    fixture = TestBed.createComponent(ProjectDmsFolderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
