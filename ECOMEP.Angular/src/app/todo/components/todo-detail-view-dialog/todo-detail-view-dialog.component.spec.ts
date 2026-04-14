import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetailViewDialogComponent } from './todo-detail-view-dialog.component';

describe('TodoDetailViewDialogComponent', () => {
  let component: TodoDetailViewDialogComponent;
  let fixture: ComponentFixture<TodoDetailViewDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoDetailViewDialogComponent]
    });
    fixture = TestBed.createComponent(TodoDetailViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
