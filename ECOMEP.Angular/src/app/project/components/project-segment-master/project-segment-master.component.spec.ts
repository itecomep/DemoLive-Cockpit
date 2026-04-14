import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSegmentMasterComponent } from './project-segment-master.component';

describe('ProjectSegmentMasterComponent', () => {
  let component: ProjectSegmentMasterComponent;
  let fixture: ComponentFixture<ProjectSegmentMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectSegmentMasterComponent]
    });
    fixture = TestBed.createComponent(ProjectSegmentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
