import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetScheduleListComponent } from './asset-schedule-list.component';

describe('AssetScheduleListComponent', () => {
  let component: AssetScheduleListComponent;
  let fixture: ComponentFixture<AssetScheduleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetScheduleListComponent]
    });
    fixture = TestBed.createComponent(AssetScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
