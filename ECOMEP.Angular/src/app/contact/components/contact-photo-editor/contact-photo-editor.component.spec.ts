import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPhotoEditorComponent } from './contact-photo-editor.component';

describe('ContactPhotoEditorComponent', () => {
  let component: ContactPhotoEditorComponent;
  let fixture: ComponentFixture<ContactPhotoEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactPhotoEditorComponent]
});
    fixture = TestBed.createComponent(ContactPhotoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
