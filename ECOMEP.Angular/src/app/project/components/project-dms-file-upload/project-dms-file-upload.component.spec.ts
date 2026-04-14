import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDmsFileUploadComponent } from './project-dms-file-upload.component';

describe('ProjectDmsFileUploadComponent', () => {
  let component: ProjectDmsFileUploadComponent;
  let fixture: ComponentFixture<ProjectDmsFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDmsFileUploadComponent]
    });
    fixture = TestBed.createComponent(ProjectDmsFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
