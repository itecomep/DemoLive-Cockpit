import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSettingMasterComponent } from './app-setting-master.component';

describe('AppSettingMasterComponent', () => {
  let component: AppSettingMasterComponent;
  let fixture: ComponentFixture<AppSettingMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppSettingMasterComponent]
    });
    fixture = TestBed.createComponent(AppSettingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
