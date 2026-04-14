import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupDialogComponent } from './permission-group-dialog.component';

describe('PermissionGroupDialogComponent', () => {
  let component: PermissionGroupDialogComponent;
  let fixture: ComponentFixture<PermissionGroupDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PermissionGroupDialogComponent]
    });
    fixture = TestBed.createComponent(PermissionGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
