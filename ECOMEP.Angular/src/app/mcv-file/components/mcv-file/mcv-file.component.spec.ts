import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvFileComponent } from './mcv-file.component';

describe('McvFileComponent', () => {
  let component: McvFileComponent;
  let fixture: ComponentFixture<McvFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvFileComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McvFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
