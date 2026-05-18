import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageStatusDashboardComponent } from './stage-status-dashboard.component';

describe('StageStatusDashboardComponent', () => {
  let component: StageStatusDashboardComponent;
  let fixture: ComponentFixture<StageStatusDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageStatusDashboardComponent]
    });
    fixture = TestBed.createComponent(StageStatusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
