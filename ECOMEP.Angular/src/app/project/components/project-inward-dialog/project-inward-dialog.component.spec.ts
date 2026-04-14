import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInwardDialogComponent } from './project-inward-dialog.component';

describe('ProjectInwardDialogComponent', () => {
  let component: ProjectInwardDialogComponent;
  let fixture: ComponentFixture<ProjectInwardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectInwardDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInwardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
