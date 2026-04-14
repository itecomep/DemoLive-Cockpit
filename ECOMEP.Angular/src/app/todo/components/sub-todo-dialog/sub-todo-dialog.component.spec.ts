import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTodoDialogComponent } from './sub-todo-dialog.component';

describe('SubTodoDialogComponent', () => {
  let component: SubTodoDialogComponent;
  let fixture: ComponentFixture<SubTodoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubTodoDialogComponent]
    });
    fixture = TestBed.createComponent(SubTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
