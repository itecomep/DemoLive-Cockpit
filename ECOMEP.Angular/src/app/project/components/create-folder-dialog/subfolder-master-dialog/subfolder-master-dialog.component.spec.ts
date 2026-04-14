import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubfolderMasterDialogComponent } from './subfolder-master-dialog.component';

describe('SubfolderMasterDialogComponent', () => {
  let component: SubfolderMasterDialogComponent;
  let fixture: ComponentFixture<SubfolderMasterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubfolderMasterDialogComponent]
    });
    fixture = TestBed.createComponent(SubfolderMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
