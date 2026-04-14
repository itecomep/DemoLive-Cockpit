import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressFormComponent } from './contact-address-form.component';

describe('ContactAddressFormComponent', () => {
  let component: ContactAddressFormComponent;
  let fixture: ComponentFixture<ContactAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactAddressFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContactAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
