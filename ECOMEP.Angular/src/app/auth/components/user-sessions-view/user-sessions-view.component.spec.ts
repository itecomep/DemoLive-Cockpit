import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSessionsViewComponent } from './user-sessions-view.component';

describe('UserSessionsViewComponent', () => {
  let component: UserSessionsViewComponent;
  let fixture: ComponentFixture<UserSessionsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserSessionsViewComponent]
    });
    fixture = TestBed.createComponent(UserSessionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
