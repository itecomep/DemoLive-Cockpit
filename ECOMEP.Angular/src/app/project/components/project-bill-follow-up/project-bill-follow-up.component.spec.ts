import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBillFollowUpComponent } from './project-bill-follow-up.component';

describe('ProjectBillFollowUpComponent', () => {
  let component: ProjectBillFollowUpComponent;
  let fixture: ComponentFixture<ProjectBillFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectBillFollowUpComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBillFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
