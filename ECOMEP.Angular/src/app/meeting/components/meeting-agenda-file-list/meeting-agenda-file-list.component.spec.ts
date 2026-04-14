import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAgendaFileListComponent } from './meeting-agenda-file-list.component';

describe('MeetingAgendaFileListComponent', () => {
  let component: MeetingAgendaFileListComponent;
  let fixture: ComponentFixture<MeetingAgendaFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingAgendaFileListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAgendaFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
