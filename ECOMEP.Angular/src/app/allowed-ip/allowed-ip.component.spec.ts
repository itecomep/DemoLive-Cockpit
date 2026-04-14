import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedIpComponent } from './allowed-ip.component';

describe('AllowedIpComponent', () => {
  let component: AllowedIpComponent;
  let fixture: ComponentFixture<AllowedIpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllowedIpComponent]
    });
    fixture = TestBed.createComponent(AllowedIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
