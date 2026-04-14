import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamUpdateComponent } from './contact-team-update.component';

describe('ContactTeamUpdateComponent', () => {
  let component: ContactTeamUpdateComponent;
  let fixture: ComponentFixture<ContactTeamUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamUpdateComponent]
});
    fixture = TestBed.createComponent(ContactTeamUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
