import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineGroupDialogComponent } from './time-line-group-dialog.component';

describe('TimeLineGroupDialogComponent', () => {
  let component: TimeLineGroupDialogComponent;
  let fixture: ComponentFixture<TimeLineGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TimeLineGroupDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TimeLineGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
