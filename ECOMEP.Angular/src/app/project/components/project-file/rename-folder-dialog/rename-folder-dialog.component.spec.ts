import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameFolderDialogComponent } from './rename-folder-dialog.component';

describe('RenameFolderDialogComponent', () => {
  let component: RenameFolderDialogComponent;
  let fixture: ComponentFixture<RenameFolderDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenameFolderDialogComponent]
    });
    fixture = TestBed.createComponent(RenameFolderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
