import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTicketDmsFolderNavigatorComponent } from './request-ticket-dms-folder-navigator.component';

describe('RequestTicketDmsFolderNavigatorComponent', () => {
  let component: RequestTicketDmsFolderNavigatorComponent;
  let fixture: ComponentFixture<RequestTicketDmsFolderNavigatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequestTicketDmsFolderNavigatorComponent]
    });
    fixture = TestBed.createComponent(RequestTicketDmsFolderNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
