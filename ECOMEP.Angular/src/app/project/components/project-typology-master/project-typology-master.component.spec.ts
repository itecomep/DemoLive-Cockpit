import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTypologyMasterComponent } from './project-typology-master.component';

describe('ProjectTypologyMasterComponent', () => {
  let component: ProjectTypologyMasterComponent;
  let fixture: ComponentFixture<ProjectTypologyMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTypologyMasterComponent]
    });
    fixture = TestBed.createComponent(ProjectTypologyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
