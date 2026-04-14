import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFileComponent } from './asset-file.component';

describe('AssetFileComponent', () => {
  let component: AssetFileComponent;
  let fixture: ComponentFixture<AssetFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetFileComponent]
    });
    fixture = TestBed.createComponent(AssetFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
