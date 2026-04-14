import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWorkOrderComponent } from './project-work-order.component';

describe('ProjectWorkOrderComponent', () => {
  let component: ProjectWorkOrderComponent;
  let fixture: ComponentFixture<ProjectWorkOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectWorkOrderComponent]
    });
    fixture = TestBed.createComponent(ProjectWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
