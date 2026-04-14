import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLinkDialogComponent } from './asset-link-dialog.component';

describe('AssetLinkDialogComponent', () => {
  let component: AssetLinkDialogComponent;
  let fixture: ComponentFixture<AssetLinkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetLinkDialogComponent]
    });
    fixture = TestBed.createComponent(AssetLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
