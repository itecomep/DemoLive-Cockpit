import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvActivityDialogComponent } from './mcv-activity-dialog.component';

describe('McvActivityDialogComponent', () => {
  let component: McvActivityDialogComponent;
  let fixture: ComponentFixture<McvActivityDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [McvActivityDialogComponent]
    });
    fixture = TestBed.createComponent(McvActivityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
