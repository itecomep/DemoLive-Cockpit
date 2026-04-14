import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTimeEntryListComponent } from './meeting-time-entry-list.component';

describe('MeetingTimeEntryListComponent', () => {
  let component: MeetingTimeEntryListComponent;
  let fixture: ComponentFixture<MeetingTimeEntryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingTimeEntryListComponent]
    });
    fixture = TestBed.createComponent(MeetingTimeEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
