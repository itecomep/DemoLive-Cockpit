import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamDocumentsCategoryEditComponent } from './contact-team-documents-category-edit.component';

describe('ContactTeamDocumentsCategoryEditComponent', () => {
  let component: ContactTeamDocumentsCategoryEditComponent;
  let fixture: ComponentFixture<ContactTeamDocumentsCategoryEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactTeamDocumentsCategoryEditComponent]
    });
    fixture = TestBed.createComponent(ContactTeamDocumentsCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
