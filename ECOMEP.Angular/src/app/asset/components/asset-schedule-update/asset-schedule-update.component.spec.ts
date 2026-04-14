import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetScheduleUpdateComponent } from './asset-schedule-update.component';

describe('AssetScheduleUpdateComponent', () => {
  let component: AssetScheduleUpdateComponent;
  let fixture: ComponentFixture<AssetScheduleUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetScheduleUpdateComponent]
    });
    fixture = TestBed.createComponent(AssetScheduleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
