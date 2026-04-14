import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitMeetingAgendaListItemComponent } from './cockpit-meeting-agenda-list-item.component';

describe('CockpitMeetingAgendaListItemComponent', () => {
  let component: CockpitMeetingAgendaListItemComponent;
  let fixture: ComponentFixture<CockpitMeetingAgendaListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitMeetingAgendaListItemComponent]
    });
    fixture = TestBed.createComponent(CockpitMeetingAgendaListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
