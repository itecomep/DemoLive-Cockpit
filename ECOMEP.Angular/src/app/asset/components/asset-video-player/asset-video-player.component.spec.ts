import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetVideoPlayerComponent } from './asset-video-player.component';

describe('AssetVideoPlayerComponent', () => {
  let component: AssetVideoPlayerComponent;
  let fixture: ComponentFixture<AssetVideoPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetVideoPlayerComponent]
    });
    fixture = TestBed.createComponent(AssetVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
