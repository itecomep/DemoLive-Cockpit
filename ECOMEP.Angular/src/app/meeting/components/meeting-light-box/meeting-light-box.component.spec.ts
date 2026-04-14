import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingLightBoxComponent } from './meeting-light-box.component';

describe('MeetingLightBoxComponent', () => {
  let component: MeetingLightBoxComponent;
  let fixture: ComponentFixture<MeetingLightBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingLightBoxComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingLightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
