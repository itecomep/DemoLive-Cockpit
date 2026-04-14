import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPhoneFormComponent } from './contact-phone-form.component';

describe('ContactPhoneFormComponent', () => {
  let component: ContactPhoneFormComponent;
  let fixture: ComponentFixture<ContactPhoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactPhoneFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContactPhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
