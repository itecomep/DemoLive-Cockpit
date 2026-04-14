import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAssociationComponent } from './contact-association.component';

describe('ContactAssociationComponent', () => {
  let component: ContactAssociationComponent;
  let fixture: ComponentFixture<ContactAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ContactAssociationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAssociationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
