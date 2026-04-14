import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeLineGroupFormComponent } from './time-line-group-form.component';

describe('TimeLineGroupFormComponent', () => {
  let component: TimeLineGroupFormComponent;
  let fixture: ComponentFixture<TimeLineGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TimeLineGroupFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TimeLineGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
