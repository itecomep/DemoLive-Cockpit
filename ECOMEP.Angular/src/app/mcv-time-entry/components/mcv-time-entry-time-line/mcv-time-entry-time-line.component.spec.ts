import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTimeEntryTimeLineComponent } from './mcv-time-entry-time-line.component';

describe('McvTimeEntryTimeLineComponent', () => {
  let component: McvTimeEntryTimeLineComponent;
  let fixture: ComponentFixture<McvTimeEntryTimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvTimeEntryTimeLineComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvTimeEntryTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
