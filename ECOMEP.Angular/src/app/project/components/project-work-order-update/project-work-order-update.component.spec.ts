import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderUpdateComponent } from './project-work-order-update.component';

describe('ProjectWorkOrderUpdateComponent', () => {
  let component: ProjectWorkOrderUpdateComponent;
  let fixture: ComponentFixture<ProjectWorkOrderUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderUpdateComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
