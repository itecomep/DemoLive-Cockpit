import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLightBoxComponent } from './asset-light-box.component';

describe('AssetLightBoxComponent', () => {
  let component: AssetLightBoxComponent;
  let fixture: ComponentFixture<AssetLightBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetLightBoxComponent]
    });
    fixture = TestBed.createComponent(AssetLightBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
