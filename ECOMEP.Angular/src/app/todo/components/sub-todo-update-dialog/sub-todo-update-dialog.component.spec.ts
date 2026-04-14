import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTodoUpdateDialogComponent } from './sub-todo-update-dialog.component';

describe('SubTodoUpdateDialogComponent', () => {
  let component: SubTodoUpdateDialogComponent;
  let fixture: ComponentFixture<SubTodoUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubTodoUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(SubTodoUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
