import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfTaskTodoRequestTicketActionComponent } from './wf-task-todo-request-ticket-action.component';

describe('WfTaskTodoRequestTicketActionComponent', () => {
  let component: WfTaskTodoRequestTicketActionComponent;
  let fixture: ComponentFixture<WfTaskTodoRequestTicketActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WfTaskTodoRequestTicketActionComponent]
    });
    fixture = TestBed.createComponent(WfTaskTodoRequestTicketActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
