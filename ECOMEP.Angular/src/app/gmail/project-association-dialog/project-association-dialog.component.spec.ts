import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssociationDialogComponent } from './project-association-dialog.component';

describe('ProjectAssociationDialogComponent', () => {
  let component: ProjectAssociationDialogComponent;
  let fixture: ComponentFixture<ProjectAssociationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAssociationDialogComponent]
    });
    fixture = TestBed.createComponent(ProjectAssociationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
