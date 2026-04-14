import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDmsFolderNavigatorComponent } from './todo-dms-folder-navigator.component';

describe('TodoDmsFolderNavigatorComponent', () => {
  let component: TodoDmsFolderNavigatorComponent;
  let fixture: ComponentFixture<TodoDmsFolderNavigatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoDmsFolderNavigatorComponent]
    });
    fixture = TestBed.createComponent(TodoDmsFolderNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
