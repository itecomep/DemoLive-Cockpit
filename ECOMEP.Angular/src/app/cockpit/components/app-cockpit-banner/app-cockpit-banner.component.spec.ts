import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCockpitBannerComponent } from './app-cockpit-banner.component';

describe('AppCockpitBannerComponent', () => {
  let component: AppCockpitBannerComponent;
  let fixture: ComponentFixture<AppCockpitBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AppCockpitBannerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AppCockpitBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
