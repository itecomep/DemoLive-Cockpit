import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetNewCategoryComponent } from './asset-new-category.component';

describe('AssetNewCategoryComponent', () => {
  let component: AssetNewCategoryComponent;
  let fixture: ComponentFixture<AssetNewCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetNewCategoryComponent]
    });
    fixture = TestBed.createComponent(AssetNewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
