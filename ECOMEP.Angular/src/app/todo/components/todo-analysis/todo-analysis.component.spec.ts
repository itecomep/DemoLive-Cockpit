import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoAnalysisComponent } from './todo-analysis.component';

describe('TodoAnalysisComponent', () => {
  let component: TodoAnalysisComponent;
  let fixture: ComponentFixture<TodoAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoAnalysisComponent]
    });
    fixture = TestBed.createComponent(TodoAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
