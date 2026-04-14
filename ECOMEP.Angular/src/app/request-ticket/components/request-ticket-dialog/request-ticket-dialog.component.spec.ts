import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketDialogComponent } from './request-ticket-dialog.component';

describe('RequestTicketDialogComponent', () => {
  let component: RequestTicketDialogComponent;
  let fixture: ComponentFixture<RequestTicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RequestTicketDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
