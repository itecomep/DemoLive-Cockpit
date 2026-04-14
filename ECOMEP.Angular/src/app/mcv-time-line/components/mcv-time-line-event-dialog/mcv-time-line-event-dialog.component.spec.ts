import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTimeLineEventDialogComponent } from './mcv-time-line-event-dialog.component';

describe('McvTimeLineEventDialogComponent', () => {
  let component: McvTimeLineEventDialogComponent;
  let fixture: ComponentFixture<McvTimeLineEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvTimeLineEventDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvTimeLineEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
