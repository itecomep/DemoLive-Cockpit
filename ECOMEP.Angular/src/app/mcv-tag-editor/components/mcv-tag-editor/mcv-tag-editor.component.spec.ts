import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvTagEditorComponent } from './mcv-tag-editor.component';

describe('McvTagEditorComponent', () => {
  let component: McvTagEditorComponent;
  let fixture: ComponentFixture<McvTagEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [McvTagEditorComponent]
});
    fixture = TestBed.createComponent(McvTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
