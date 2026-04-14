import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProgressDialogComponent } from './project-progress-dialog.component';

describe('ProjectProgressDialogComponent', () => {
  let component: ProjectProgressDialogComponent;
  let fixture: ComponentFixture<ProjectProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectProgressDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
