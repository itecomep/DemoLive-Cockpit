import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInwardComponent } from './project-inward.component';

describe('ProjectInwardComponent', () => {
  let component: ProjectInwardComponent;
  let fixture: ComponentFixture<ProjectInwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectInwardComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
