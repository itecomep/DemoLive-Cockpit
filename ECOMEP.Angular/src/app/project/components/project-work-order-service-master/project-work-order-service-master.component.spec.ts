import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderServiceMasterComponent } from './project-work-order-service-master.component';

describe('ProjectWorkOrderServiceMasterComponent', () => {
  let component: ProjectWorkOrderServiceMasterComponent;
  let fixture: ComponentFixture<ProjectWorkOrderServiceMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderServiceMasterComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderServiceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
