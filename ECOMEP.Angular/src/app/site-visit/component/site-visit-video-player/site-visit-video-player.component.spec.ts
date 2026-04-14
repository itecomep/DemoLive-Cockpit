import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitVideoPlayerComponent } from './site-visit-video-player.component';

describe('SitevisitVideoPlayerComponent', () => {
  let component: SiteVisitVideoPlayerComponent;
  let fixture: ComponentFixture<SiteVisitVideoPlayerComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SiteVisitVideoPlayerComponent]
    })
    .compileComponents();
  });
  beforeEach(() =>{
    fixture = TestBed.createComponent(SiteVisitVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
