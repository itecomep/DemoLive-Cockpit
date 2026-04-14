import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketComponent } from './request-ticket.component';

describe('RequestTicketComponent', () => {
  let component: RequestTicketComponent;
  let fixture: ComponentFixture<RequestTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
