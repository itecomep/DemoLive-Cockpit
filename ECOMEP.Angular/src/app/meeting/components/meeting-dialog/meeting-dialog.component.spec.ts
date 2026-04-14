import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MeetingDialogComponent } from './meeting-dialog.component';

describe('MeetingDialogComponent', () => {
  let component: MeetingDialogComponent;
  let fixture: ComponentFixture<MeetingDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [MeetingDialogComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
