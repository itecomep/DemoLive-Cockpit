import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvFileUploadComponent } from './mcv-file-upload.component';

describe('McvFileUploadComponent', () => {
  let component: McvFileUploadComponent;
  let fixture: ComponentFixture<McvFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvFileUploadComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McvFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
