import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTaskProgressDialogComponent } from './team-task-progress-dialog.component';

describe('TeamTaskProgressDialogComponent', () => {
  let component: TeamTaskProgressDialogComponent;
  let fixture: ComponentFixture<TeamTaskProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TeamTaskProgressDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(TeamTaskProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
