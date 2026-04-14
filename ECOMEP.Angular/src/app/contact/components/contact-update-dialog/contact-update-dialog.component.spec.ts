import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUpdateDialogComponent } from './contact-update-dialog.component';

describe('ContactUpdateDialogComponent', () => {
  let component: ContactUpdateDialogComponent;
  let fixture: ComponentFixture<ContactUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(ContactUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
