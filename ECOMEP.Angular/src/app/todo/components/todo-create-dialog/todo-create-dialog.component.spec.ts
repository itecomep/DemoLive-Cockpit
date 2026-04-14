import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreateDialogComponent } from './todo-create-dialog.component';

describe('TodoCreateDialogComponent', () => {
  let component: TodoCreateDialogComponent;
  let fixture: ComponentFixture<TodoCreateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoCreateDialogComponent]
    });
    fixture = TestBed.createComponent(TodoCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
