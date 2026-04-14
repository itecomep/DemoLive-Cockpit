import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillUpdateComponent } from './project-bill-update.component';

describe('ProjectBillUpdateComponent', () => {
  let component: ProjectBillUpdateComponent;
  let fixture: ComponentFixture<ProjectBillUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectBillUpdateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBillUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
