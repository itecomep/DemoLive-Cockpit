import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketListViewComponent } from './request-ticket-list-view.component';

describe('RequestTicketListViewComponent', () => {
  let component: RequestTicketListViewComponent;
  let fixture: ComponentFixture<RequestTicketListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketListViewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
