import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingListViewComponent } from './meeting-list-view.component';

describe('MeetingListViewComponent', () => {
  let component: MeetingListViewComponent;
  let fixture: ComponentFixture<MeetingListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MeetingListViewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MeetingListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
