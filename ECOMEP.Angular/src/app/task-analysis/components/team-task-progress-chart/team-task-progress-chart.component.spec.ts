import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTaskProgressChartComponent } from './team-task-progress-chart.component';

describe('TeamTaskProgressChartComponent', () => {
  let component: TeamTaskProgressChartComponent;
  let fixture: ComponentFixture<TeamTaskProgressChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamTaskProgressChartComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeamTaskProgressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
