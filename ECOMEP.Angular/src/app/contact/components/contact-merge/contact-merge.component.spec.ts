import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMergeComponent } from './contact-merge.component';

describe('ContactMergeComponent', () => {
  let component: ContactMergeComponent;
  let fixture: ComponentFixture<ContactMergeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactMergeComponent]
});
    fixture = TestBed.createComponent(ContactMergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
