import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStageMailViewComponent } from './project-stage-mail-view.component';

describe('ProjectStageMailViewComponent', () => {
  let component: ProjectStageMailViewComponent;
  let fixture: ComponentFixture<ProjectStageMailViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectStageMailViewComponent]
    });
    fixture = TestBed.createComponent(ProjectStageMailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
