import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketTaskActionComponent } from './request-ticket-task-action.component';

describe('RequestTicketTaskActionComponent', () => {
  let component: RequestTicketTaskActionComponent;
  let fixture: ComponentFixture<RequestTicketTaskActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTicketTaskActionComponent]
    });
    fixture = TestBed.createComponent(RequestTicketTaskActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
