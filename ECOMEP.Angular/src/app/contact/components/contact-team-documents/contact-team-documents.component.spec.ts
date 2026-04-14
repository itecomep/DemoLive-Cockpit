import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamDocumentsComponent } from './contact-team-documents.component';

describe('ContactTeamDocumentsComponent', () => {
  let component: ContactTeamDocumentsComponent;
  let fixture: ComponentFixture<ContactTeamDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactTeamDocumentsComponent]
    });
    fixture = TestBed.createComponent(ContactTeamDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
