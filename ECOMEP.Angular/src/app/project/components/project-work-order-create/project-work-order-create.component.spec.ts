import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProjectWorkOrderCreateComponent } from './project-work-order-create.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProjectWorkOrderApiService } from '../../services/project-work-order-api.service';
import { ProjectWorkOrderAttachmentApiService } from '../../services/project-work-order-attachment-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppSettingMasterApiService } from 'src/app/shared/services/app-setting-master-api.service';

describe('ProjectWorkOrderCreateComponent', () => {
  let component: ProjectWorkOrderCreateComponent;
  let fixture: ComponentFixture<ProjectWorkOrderCreateComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ProjectWorkOrderCreateComponent>>;
  let mockProjectWorkOrderApiService: jasmine.SpyObj<ProjectWorkOrderApiService>;
  let mockProjectWorkOrderAttachmentApiService: jasmine.SpyObj<ProjectWorkOrderAttachmentApiService>;
  let mockUtilityService: jasmine.SpyObj<UtilityService>;
  let mockAppSettingService: jasmine.SpyObj<AppSettingMasterApiService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockProjectWorkOrderApiService = jasmine.createSpyObj('ProjectWorkOrderApiService', ['create']);
    mockProjectWorkOrderAttachmentApiService = jasmine.createSpyObj('ProjectWorkOrderAttachmentApiService', ['create']);
    mockUtilityService = jasmine.createSpyObj('UtilityService', ['getErrorMessage', 'showSweetDialog'], { isMobileView: false });
    mockAppSettingService = jasmine.createSpyObj('AppSettingMasterApiService', ['presets']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProjectWorkOrderCreateComponent],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { projectID: 1 } },
        { provide: UtilityService, useValue: mockUtilityService },
        { provide: AppSettingMasterApiService, useValue: mockAppSettingService },
        { provide: ProjectWorkOrderApiService, useValue: mockProjectWorkOrderApiService },
        { provide: ProjectWorkOrderAttachmentApiService, useValue: mockProjectWorkOrderAttachmentApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectWorkOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component init', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['workOrderNo']).toBeDefined();
  });

  it('should set projectID from dialog data', () => {
    expect(component.projectID).toEqual(1);
  });

  it('should validate form and show error message if invalid on submit', fakeAsync(() => {
    component.form.controls['workOrderNo'].setValue(null);
    component.onSubmit();
    tick();
    expect(mockUtilityService.showSweetDialog).toHaveBeenCalledWith(
      'Incomplete data!',
      'Please fill all required fields with valid data and try again!',
      'warning'
    );
  }));

  it('should submit the form and close the dialog', fakeAsync(() => {
    component.form.controls['workOrderNo'].setValue('WO123');
    component.form.controls['workOrderDate'].setValue(new Date());
    component.form.controls['dueDate'].setValue(new Date());
    component.form.controls['fees'].setValue(100);
    
    mockProjectWorkOrderApiService.create.and.returnValue(of({ id: 1 }));
    component.onSubmit();
    tick();
    expect(mockDialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1 }));
  }));

  it('should close the dialog when onClose is called', () => {
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
