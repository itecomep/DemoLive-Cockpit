import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillDetailsEditComponent } from './project-bill-details-edit.component';

describe('ProjectBillDetailsEditComponent', () => {
  let component: ProjectBillDetailsEditComponent;
  let fixture: ComponentFixture<ProjectBillDetailsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectBillDetailsEditComponent]
    });
    fixture = TestBed.createComponent(ProjectBillDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
