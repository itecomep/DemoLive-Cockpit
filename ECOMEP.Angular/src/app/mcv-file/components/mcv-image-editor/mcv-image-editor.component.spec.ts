import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvImageEditorComponent } from './mcv-image-editor.component';

describe('McvImageEditorComponent', () => {
  let component: McvImageEditorComponent;
  let fixture: ComponentFixture<McvImageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvImageEditorComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McvImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
