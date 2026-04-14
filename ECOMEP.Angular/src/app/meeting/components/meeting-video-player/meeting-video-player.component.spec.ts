import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingVideoPlayerComponent } from './meeting-video-player.component';

describe('MeetingVideoPlayerComponent', () => {
  let component: MeetingVideoPlayerComponent;
  let fixture: ComponentFixture<MeetingVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingVideoPlayerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
