import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketPagedListComponent } from './request-ticket-paged-list.component';

describe('RequestTicketPagedListComponent', () => {
  let component: RequestTicketPagedListComponent;
  let fixture: ComponentFixture<RequestTicketPagedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketPagedListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketPagedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
