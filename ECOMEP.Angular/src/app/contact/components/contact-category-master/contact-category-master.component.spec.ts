import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCategoryMasterComponent } from './contact-category-master.component';

describe('ContactCategoryMasterComponent', () => {
  let component: ContactCategoryMasterComponent;
  let fixture: ComponentFixture<ContactCategoryMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactCategoryMasterComponent]
});
    fixture = TestBed.createComponent(ContactCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
