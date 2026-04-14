import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvPopoverContentComponent } from './mcv-popover-content.component';

describe('McvPopoverContentComponent', () => {
  let component: McvPopoverContentComponent;
  let fixture: ComponentFixture<McvPopoverContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvPopoverContentComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvPopoverContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
