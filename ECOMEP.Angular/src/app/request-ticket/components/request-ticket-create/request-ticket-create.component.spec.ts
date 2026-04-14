import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketCreateComponent } from './request-ticket-create.component';

describe('RequestTicketCreateComponent', () => {
  let component: RequestTicketCreateComponent;
  let fixture: ComponentFixture<RequestTicketCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RequestTicketCreateComponent]
});
    fixture = TestBed.createComponent(RequestTicketCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
