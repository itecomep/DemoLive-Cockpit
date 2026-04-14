import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLightBoxDialogComponent } from './asset-light-box-dialog.component';

describe('AssetLightBoxDialogComponent', () => {
  let component: AssetLightBoxDialogComponent;
  let fixture: ComponentFixture<AssetLightBoxDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetLightBoxDialogComponent]
    });
    fixture = TestBed.createComponent(AssetLightBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
