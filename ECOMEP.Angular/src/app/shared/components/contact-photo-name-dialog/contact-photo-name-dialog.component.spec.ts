import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPhotoNameDialogComponent } from './contact-photo-name-dialog.component';

describe('ContactPhotoNameDialogComponent', () => {
  let component: ContactPhotoNameDialogComponent;
  let fixture: ComponentFixture<ContactPhotoNameDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactPhotoNameDialogComponent]
    });
    fixture = TestBed.createComponent(ContactPhotoNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
