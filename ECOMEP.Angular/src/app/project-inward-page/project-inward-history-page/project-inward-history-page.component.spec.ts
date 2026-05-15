import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInwardHistoryPageComponent } from './project-inward-history-page.component';

describe('ProjectInwardHistoryPageComponent', () => {
  let component: ProjectInwardHistoryPageComponent;
  let fixture: ComponentFixture<ProjectInwardHistoryPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectInwardHistoryPageComponent]
    });
    fixture = TestBed.createComponent(ProjectInwardHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
