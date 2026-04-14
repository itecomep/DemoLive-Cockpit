import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactProjectsComponent } from './contact-projects.component';

describe('ContactProjectsComponent', () => {
  let component: ContactProjectsComponent;
  let fixture: ComponentFixture<ContactProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactProjectsComponent]
    });
    fixture = TestBed.createComponent(ContactProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
