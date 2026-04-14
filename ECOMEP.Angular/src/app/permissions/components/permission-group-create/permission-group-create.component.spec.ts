import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupCreateComponent } from './permission-group-create.component';

describe('PermissionGroupCreateComponent', () => {
  let component: PermissionGroupCreateComponent;
  let fixture: ComponentFixture<PermissionGroupCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PermissionGroupCreateComponent]
    });
    fixture = TestBed.createComponent(PermissionGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
