import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesViewComponent } from './meeting-minutes-view.component';

describe('MeetingMinutesViewComponent', () => {
  let component: MeetingMinutesViewComponent;
  let fixture: ComponentFixture<MeetingMinutesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingMinutesViewComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMinutesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
