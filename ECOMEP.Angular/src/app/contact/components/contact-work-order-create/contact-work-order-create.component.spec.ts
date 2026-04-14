import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderCreateComponent } from './contact-work-order-create.component';

describe('ContactWorkOrderCreateComponent', () => {
  let component: ContactWorkOrderCreateComponent;
  let fixture: ComponentFixture<ContactWorkOrderCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderCreateComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
