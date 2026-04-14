import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoPagedListComponent } from './todo-paged-list.component';

describe('TodoPagedListComponent', () => {
  let component: TodoPagedListComponent;
  let fixture: ComponentFixture<TodoPagedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TodoPagedListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TodoPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
