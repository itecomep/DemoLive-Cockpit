import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitMeetingAgendasComponent } from './cockpit-meeting-agendas.component';

describe('CockpitMeetingAgendasComponent', () => {
  let component: CockpitMeetingAgendasComponent;
  let fixture: ComponentFixture<CockpitMeetingAgendasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CockpitMeetingAgendasComponent]
    });
    fixture = TestBed.createComponent(CockpitMeetingAgendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
