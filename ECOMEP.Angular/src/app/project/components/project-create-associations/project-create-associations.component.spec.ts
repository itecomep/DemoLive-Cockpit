import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCreateAssociationsComponent } from './project-create-associations.component';

describe('ProjectCreateAssociationsComponent', () => {
  let component: ProjectCreateAssociationsComponent;
  let fixture: ComponentFixture<ProjectCreateAssociationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectCreateAssociationsComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCreateAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
