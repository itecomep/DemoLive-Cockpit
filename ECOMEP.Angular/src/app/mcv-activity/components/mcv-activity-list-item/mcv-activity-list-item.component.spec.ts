import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvActivityListItemComponent } from './mcv-activity-list-item.component';

describe('McvActivityListItemComponent', () => {
  let component: McvActivityListItemComponent;
  let fixture: ComponentFixture<McvActivityListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvActivityListItemComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvActivityListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
