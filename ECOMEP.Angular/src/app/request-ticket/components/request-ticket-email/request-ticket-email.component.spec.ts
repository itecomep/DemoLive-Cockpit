import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketEmailComponent } from './request-ticket-email.component';

describe('RequestTicketEmailComponent', () => {
  let component: RequestTicketEmailComponent;
  let fixture: ComponentFixture<RequestTicketEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketEmailComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
