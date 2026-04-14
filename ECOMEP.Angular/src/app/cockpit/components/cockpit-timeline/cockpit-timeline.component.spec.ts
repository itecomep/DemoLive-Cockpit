import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CockpitTimelineComponent } from './cockpit-timeline.component';

describe('CockpitTimelineComponent', () => {
  let component: CockpitTimelineComponent;
  let fixture: ComponentFixture<CockpitTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CockpitTimelineComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(CockpitTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
