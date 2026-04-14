import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamUpdateDialogComponent } from './contact-team-update-dialog.component';

describe('ContactTeamUpdateDialogComponent', () => {
  let component: ContactTeamUpdateDialogComponent;
  let fixture: ComponentFixture<ContactTeamUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactTeamUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ContactTeamUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
