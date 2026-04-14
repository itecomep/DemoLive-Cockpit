import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillsComponent } from './project-bills.component';

describe('ProjectBillsComponent', () => {
  let component: ProjectBillsComponent;
  let fixture: ComponentFixture<ProjectBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectBillsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
