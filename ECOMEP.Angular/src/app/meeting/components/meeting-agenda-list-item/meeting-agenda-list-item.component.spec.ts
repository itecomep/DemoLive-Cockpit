import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaListItemComponent } from './meeting-agenda-list-item.component';

describe('MeetingAgendaListItemComponent', () => {
  let component: MeetingAgendaListItemComponent;
  let fixture: ComponentFixture<MeetingAgendaListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MeetingAgendaListItemComponent]
    });
    fixture = TestBed.createComponent(MeetingAgendaListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
