import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssociationContactListItemComponent } from './project-association-contact-list-item.component';

describe('ProjectAssociationContactListItemComponent', () => {
  let component: ProjectAssociationContactListItemComponent;
  let fixture: ComponentFixture<ProjectAssociationContactListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectAssociationContactListItemComponent]
    });
    fixture = TestBed.createComponent(ProjectAssociationContactListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
