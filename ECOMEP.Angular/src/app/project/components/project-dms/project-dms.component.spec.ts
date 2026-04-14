import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDmsComponent } from './project-dms.component';

describe('ProjectDmsComponent', () => {
  let component: ProjectDmsComponent;
  let fixture: ComponentFixture<ProjectDmsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectDmsComponent]
    });
    fixture = TestBed.createComponent(ProjectDmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
