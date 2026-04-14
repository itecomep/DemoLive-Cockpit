import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDuplicateDialogComponent } from './todo-duplicate-dialog.component';

describe('TodoDuplicateDialogComponent', () => {
  let component: TodoDuplicateDialogComponent;
  let fixture: ComponentFixture<TodoDuplicateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoDuplicateDialogComponent]
    });
    fixture = TestBed.createComponent(TodoDuplicateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
