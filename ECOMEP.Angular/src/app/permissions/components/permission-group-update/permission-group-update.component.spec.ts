import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionGroupUpdateComponent } from './permission-group-update.component';

describe('PermissionGroupUpdateComponent', () => {
  let component: PermissionGroupUpdateComponent;
  let fixture: ComponentFixture<PermissionGroupUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PermissionGroupUpdateComponent]
    });
    fixture = TestBed.createComponent(PermissionGroupUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
