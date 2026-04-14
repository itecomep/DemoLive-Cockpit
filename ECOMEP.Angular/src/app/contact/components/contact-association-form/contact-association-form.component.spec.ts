import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssociationFormComponent } from './contact-association-form.component';

describe('ContactAssociationFormComponent', () => {
  let component: ContactAssociationFormComponent;
  let fixture: ComponentFixture<ContactAssociationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactAssociationFormComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ContactAssociationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
