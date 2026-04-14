import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderComponent } from './contact-work-order.component';

describe('ContactWorkOrderComponent', () => {
  let component: ContactWorkOrderComponent;
  let fixture: ComponentFixture<ContactWorkOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
