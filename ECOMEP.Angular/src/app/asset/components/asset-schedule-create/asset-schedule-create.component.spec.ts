import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetScheduleCreateComponent } from './asset-schedule-create.component';

describe('AssetScheduleCreateComponent', () => {
  let component: AssetScheduleCreateComponent;
  let fixture: ComponentFixture<AssetScheduleCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetScheduleCreateComponent]
    });
    fixture = TestBed.createComponent(AssetScheduleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
