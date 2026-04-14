import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionFileDialogComponent } from './user-permission-file-dialog.component';

describe('UserPermissionFileDialogComponent', () => {
  let component: UserPermissionFileDialogComponent;
  let fixture: ComponentFixture<UserPermissionFileDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPermissionFileDialogComponent]
    });
    fixture = TestBed.createComponent(UserPermissionFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
