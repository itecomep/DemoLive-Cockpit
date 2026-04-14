import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDefinitionComponent } from './project-definition.component';

describe('ProjectDefinitionComponent', () => {
  let component: ProjectDefinitionComponent;
  let fixture: ComponentFixture<ProjectDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectDefinitionComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
