import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitevisitLightBoxComponent } from './site-visit-light-box.component';

describe('SitevisitLightBoxComponent', () => {
  let component: SitevisitLightBoxComponent;
  let fixture: ComponentFixture<SitevisitLightBoxComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
      imports: [SitevisitLightBoxComponent]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(SitevisitLightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
