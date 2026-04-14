import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTodoViewComponent } from './project-todo-view.component';

describe('ProjectTodoViewComponent', () => {
  let component: ProjectTodoViewComponent;
  let fixture: ComponentFixture<ProjectTodoViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTodoViewComponent]
    });
    fixture = TestBed.createComponent(ProjectTodoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
