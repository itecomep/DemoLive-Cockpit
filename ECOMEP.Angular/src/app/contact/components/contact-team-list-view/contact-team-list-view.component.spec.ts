import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTeamListViewComponent } from './contact-team-list-view.component';

describe('ContactTeamListViewComponent', () => {
  let component: ContactTeamListViewComponent;
  let fixture: ComponentFixture<ContactTeamListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactTeamListViewComponent]
    });
    fixture = TestBed.createComponent(ContactTeamListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
