import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategoryMasterComponent } from './asset-category-master.component';

describe('AssetCategoryMasterComponent', () => {
  let component: AssetCategoryMasterComponent;
  let fixture: ComponentFixture<AssetCategoryMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetCategoryMasterComponent]
    });
    fixture = TestBed.createComponent(AssetCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
