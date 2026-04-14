import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTeamEditComponent } from './project-team-edit.component';

describe('ProjectTeamEditComponent', () => {
  let component: ProjectTeamEditComponent;
  let fixture: ComponentFixture<ProjectTeamEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTeamEditComponent]
    });
    fixture = TestBed.createComponent(ProjectTeamEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
