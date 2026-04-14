import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTaskProgressComponent } from './team-task-progress.component';

describe('TeamTaskProgressComponent', () => {
  let component: TeamTaskProgressComponent;
  let fixture: ComponentFixture<TeamTaskProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamTaskProgressComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeamTaskProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
