import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamComponent } from './contact-team.component';

describe('ContactTeamComponent', () => {
  let component: ContactTeamComponent;
  let fixture: ComponentFixture<ContactTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactTeamComponent]
});
    fixture = TestBed.createComponent(ContactTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
