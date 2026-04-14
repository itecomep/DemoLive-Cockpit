import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketReportComponent } from './request-ticket-report.component';

describe('RequestTicketReportComponent', () => {
  let component: RequestTicketReportComponent;
  let fixture: ComponentFixture<RequestTicketReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RequestTicketReportComponent]
});
    fixture = TestBed.createComponent(RequestTicketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
