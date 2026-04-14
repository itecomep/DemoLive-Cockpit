import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McvFileListComponent } from './mcv-file-list.component';

describe('McvFileListComponent', () => {
  let component: McvFileListComponent;
  let fixture: ComponentFixture<McvFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [McvFileListComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(McvFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
