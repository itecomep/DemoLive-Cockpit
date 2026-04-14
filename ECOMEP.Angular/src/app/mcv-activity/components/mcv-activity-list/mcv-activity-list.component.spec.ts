import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvActivityListComponent } from './mcv-activity-list.component';

describe('McvActivityListComponent', () => {
  let component: McvActivityListComponent;
  let fixture: ComponentFixture<McvActivityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvActivityListComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(McvActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
