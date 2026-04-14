import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BypassAllowedUserComponent } from './bypass-allowed-user.component';

describe('BypassAllowedUserComponent', () => {
  let component: BypassAllowedUserComponent;
  let fixture: ComponentFixture<BypassAllowedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BypassAllowedUserComponent]
    });
    fixture = TestBed.createComponent(BypassAllowedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
