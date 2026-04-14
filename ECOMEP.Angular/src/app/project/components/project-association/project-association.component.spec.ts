import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssociationComponent } from './project-association.component';

describe('ProjectAssociationComponent', () => {
  let component: ProjectAssociationComponent;
  let fixture: ComponentFixture<ProjectAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ProjectAssociationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
