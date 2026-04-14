import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillCreateComponent } from './project-bill-create.component';

describe('ProjectBillCreateComponent', () => {
  let component: ProjectBillCreateComponent;
  let fixture: ComponentFixture<ProjectBillCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectBillCreateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBillCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
