import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUserPermissionsComponent } from './contact-user-permissions.component';

describe('ContactUserPermissionsComponent', () => {
  let component: ContactUserPermissionsComponent;
  let fixture: ComponentFixture<ContactUserPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactUserPermissionsComponent]
});
    fixture = TestBed.createComponent(ContactUserPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
