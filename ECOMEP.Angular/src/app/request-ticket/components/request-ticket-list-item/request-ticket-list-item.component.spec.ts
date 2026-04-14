import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketListItemComponent } from './request-ticket-list-item.component';

describe('RequestTicketListItemComponent', () => {
  let component: RequestTicketListItemComponent;
  let fixture: ComponentFixture<RequestTicketListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketListItemComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
