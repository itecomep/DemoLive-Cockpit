import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactWorkOrderUpdateComponent } from './contact-work-order-update.component';

describe('ContactWorkOrderUpdateComponent', () => {
  let component: ContactWorkOrderUpdateComponent;
  let fixture: ComponentFixture<ContactWorkOrderUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactWorkOrderUpdateComponent]
    });
    fixture = TestBed.createComponent(ContactWorkOrderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
