import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefinitionUpdateComponent } from './project-definition-update.component';

describe('ProjectDefinitionUpdateComponent', () => {
  let component: ProjectDefinitionUpdateComponent;
  let fixture: ComponentFixture<ProjectDefinitionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectDefinitionUpdateComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefinitionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
