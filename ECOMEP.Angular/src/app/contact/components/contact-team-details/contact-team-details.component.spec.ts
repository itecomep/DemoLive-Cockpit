import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamDetailsComponent } from './contact-team-details.component';

describe('ContactTeamDetailsComponent', () => {
  let component: ContactTeamDetailsComponent;
  let fixture: ComponentFixture<ContactTeamDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamDetailsComponent]
});
    fixture = TestBed.createComponent(ContactTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
