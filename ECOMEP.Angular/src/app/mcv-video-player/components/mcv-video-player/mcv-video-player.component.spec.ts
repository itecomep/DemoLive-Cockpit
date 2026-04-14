import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvVideoPlayerComponent } from './mcv-video-player.component';

describe('McvVideoPlayerComponent', () => {
  let component: McvVideoPlayerComponent;
  let fixture: ComponentFixture<McvVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvVideoPlayerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
