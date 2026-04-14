import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, firstValueFrom } from 'rxjs';
import { Contact } from 'src/app/contact/models/contact';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ContactApiService } from 'src/app/contact/services/contact-api.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HeaderComponent } from 'src/app/mcv-header/components/header/header.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PermissionGroupDialogComponent } from '../permission-group-dialog/permission-group-dialog.component'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactPhotoNameDialogComponent } from 'src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
    MatOptionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent {
  contactFilter = [{ key: 'usersOnly', value: 'true' }];
  contactOptions: Contact[] = [];
  permissionsList: any[] = [];
  headerList: any[] = [];
  designationOptions: any[] = [];
  headerTitle: string = 'Permissions';
  selectedModule: any;
  selectedContacts: number[] = [];
  filteredContactOptions: Contact[] = [];
  originalPermissionList: any[] = []; 
  contactsSearch: string = '';
  search= new FormControl();
  designation= new FormControl();
  constructor(
    private authService: AuthService,
    private contactService: ContactApiService,
    private utilityService: UtilityService,
    private dialog: MatDialog
  ) {

    this.selectedModule = this.headerList.length > 0 ? this.headerList[0] : null;
  }

  get isMobileView() {
    return this.utilityService.isMobileView;
  }

  ngOnInit() {


    this.getContactList();
 
    this.search.valueChanges
          .pipe(
            debounceTime(400),
            distinctUntilChanged()
          )
          .subscribe((value) => {
                 if (value && value !== '') {
                   this.permissionsList = this.permissionsList.filter(
                     (contact) =>
                       contact.name.toLowerCase().includes(value.toLowerCase())
                   );
             
                 } else {
            
                   if (this.designation.value) {
                     this.permissionsList = this.originalPermissionList.filter(
                       (contact: any) =>
                         contact.appointments?.some(
                           (appointment: any) =>
                             appointment.statusFlag === 0 &&
                             appointment.designation?.toLowerCase() ===
                               this.designation.value.toLowerCase()
                         )
                     );
                 
                   }else{
                    this.clearSearch();
                   }
               
                 }
                 this.filteredContactOptions = [...this.permissionsList];
          }
          );

          this.designation.valueChanges
          .pipe(
            debounceTime(400),
            distinctUntilChanged()
          )
          .subscribe((value: string) => {
            if (value) {
              const searchValue = value.toLowerCase();
        
              this.permissionsList = this.originalPermissionList.filter((contact: any) =>
                contact.appointments?.some(
                  (appointment: any) =>
                    appointment.statusFlag === 0 &&
                    appointment.designation?.toLowerCase() === searchValue
                )
              );
                  this.filteredContactOptions = [...this.permissionsList]; 
            } else {
              this.clearSearch();
          
            }
          });
        
          
  }
  getDesignationOptions() {

  const designations = new Set<string>();

  this.permissionsList.forEach((contact: any) => {
    if (Array.isArray(contact.appointments)) {
      contact.appointments.forEach((appointment: any) => {
        if (appointment.statusFlag === 0 && appointment.designation) {
          designations.add(appointment.designation);
        }
      });
    }
  });

  this.designationOptions= Array.from(designations);




  }
  async getContactList() {
    let contactFilter = [
      { key: 'usersOnly', value: 'true' },
      { key: 'appointmentStatusFlag', value: '0' },
    ];
  
    // Fetch contacts only once
    this.contactOptions = await firstValueFrom(this.contactService.get(contactFilter));
  
    // Initialize permissions list
    this.permissionsList = [];
  
    // Set to store all role data for headerList generation
    let allRoles: any[] = [];
  
    // Fetch roles one by one and build the combined list
    for (const contact of this.contactOptions) {
      if (contact.username?.trim()) {
        let userRoles = await this.getUserRoles(contact.username.trim()); // Fetch user roles
  
        // Store roles for header list
        allRoles.push(...userRoles);
  
        // Push user data along with roles immediately
        this.permissionsList.push({
          ...contact,
          roleOptions: userRoles,
        });
      }
    }
  
    // Generate header list based on collected role data
    this.headerList = this.generateHeaderList(allRoles);
    console.log('Generated headerList:', this.headerList);
    this.originalPermissionList = [...this.permissionsList]; 
    this.filteredContactOptions = [...this.permissionsList]; 
    this.getDesignationOptions();
    // console.log('Final headerList:', this.headerList);
    // console.log('Final permissionsList:', this.permissionsList);
  }
  
  generateHeaderList(dataList: any[]): any[] {
    const headerMap = new Map<string, Map<string, Map<number, Set<string>>>>();   
    dataList.forEach(permission => {
      const { module, group, title, orderFlag } = permission;
  
      if (!headerMap.has(module)) {
        headerMap.set(module, new Map());
      }
  
      if (!headerMap.get(module)!.has(group)) {
        headerMap.get(module)!.set(group, new Map());
      }
  
      if (!headerMap.get(module)!.get(group)!.has(orderFlag)) {
        headerMap.get(module)!.get(group)!.set(orderFlag, new Set());
      }
  
      headerMap.get(module)!.get(group)!.get(orderFlag)!.add(title ?? "");
    });
  
  
    return Array.from(headerMap.entries()).map(([module, groupMap]) => ({
      name: module,
      children: Array.from(groupMap.entries()).map(([group, orderMap]) => ({
        name: group,
        permissions: Array.from(orderMap.entries())
          .sort(([orderA], [orderB]) => orderA - orderB) // Sort by orderFlag
          .flatMap(([, permissions]) => Array.from(permissions)) // Flatten sorted permissions
      })),
    }));
  }
  

async getUserRoles(username: string) {
  return await firstValueFrom(this.authService.getRoleOptionsByUsername(username)) || [];
}

checkPermission(user: any, moduleName: string, groupName: string, permission: string): boolean {
  return user.roleOptions?.some(
    (role: any) => 
      role.module === moduleName && 
      role.group === groupName && 
      role.title === permission &&
      role.isAssigned === true // Ensure it's assigned
  );
}

getGroupColSpan(groupName: string): number {
  const group = this.headerList.find((g: any) => g.name === groupName);
  return group?.permissions?.length || 1; // Default to 1 if no permissions
}

getModuleColspan(module: any): number {
  return module.children.reduce((sum:any, group:any) => sum + group.permissions.length, 0);
}

onPermissionChange(isChecked: boolean, user: any, moduleName: string, groupName: string, permission: string) {
  const matchingPermission = user.roleOptions?.find(
    (role: any) =>
      role.module === moduleName &&
      role.group === groupName &&
      role.title === permission
  );

  if (matchingPermission) {
    matchingPermission.isAssigned = isChecked;
    const roleArray = [matchingPermission.name]; // Convert to array

    if (isChecked) {
      firstValueFrom(this.authService.addRoles(user.username, roleArray));
      this.utilityService.showSwalToast('', 'Permission added successfully.');
     
    } else {
      firstValueFrom(this.authService.removeRoles(user.username, roleArray));
      this.utilityService.showSwalToast('', 'Permission removed successfully.');

    }
    
    // console.log("User:", user);
    // console.log("Matching Permission:", matchingPermission);
    // console.log("Checkbox State:", isChecked);
  }
}

onTabChange(index: number) {
  this.selectedModule = this.headerList[index];
  // console.log('this.selectedModule',this.selectedModule);
}


toggleSelection(contact: any) {
  const index = this.selectedContacts.indexOf(contact.id); // Use ID for selection tracking
  
  if (index > -1) {
    this.selectedContacts.splice(index, 1); // Deselect if already selected
  } else {
    this.selectedContacts.push(contact.id); // Select if not already selected
  }
  this.applyFilter();
}

// Toggle Select All/Deselect All
toggleSelectAll() {
  if (this.isAllSelected()) {
    this.selectedContacts = []; // Clear selection
  } else {
    this.selectedContacts = this.contactOptions.map(c => c.id); // Store all IDs as numbers
  }
  this.applyFilter();
}

// Check if all contacts are selected
isAllSelected(): boolean {
  return this.selectedContacts.length === this.contactOptions.length;
}

// Apply filter to permission list
// applyFilter() {
//   if (this.selectedContacts.length === 0) {
//     this.permissionsList = [...this.originalPermissionList]; // Reset if none selected
//   } else {
//     this.permissionsList = this.originalPermissionList.filter(permission =>
//       this.selectedContacts.includes(permission.id) // Match based on contact ID
//     );
//   }
// }
applyFilter() {
  const designationValue = this.designation.value?.toLowerCase();
  const searchValue = this.search.value?.toLowerCase();

  if (this.selectedContacts.length === 0) {
    if (designationValue || searchValue) {
      this.permissionsList = this.originalPermissionList.filter((contact: any) => {
        const matchesDesignation = designationValue
          ? contact.appointments?.some(
              (appointment: any) =>
                appointment.statusFlag === 0 &&
                appointment.designation?.toLowerCase() === designationValue
            )
          : true;

        const matchesSearch = searchValue
          ? contact.name?.toLowerCase().includes(searchValue)
          : true;

        return matchesDesignation && matchesSearch;
      });
     
    } else {
      this.permissionsList = [...this.originalPermissionList];
    }
  } else {
    this.permissionsList = this.originalPermissionList.filter(permission =>
      this.selectedContacts.includes(permission.id)
    );
  }
}



clearFilterSearch() {
  // Prevent menu from closing
  this.contactsSearch = '';
  this.selectedContacts = []; 
  this.filteredContactOptions = [...this.permissionsList];
  this.applyFilter();
}



clearSearch() {
  this.search.setValue(null);
  if(this.designation.value) {
    this.permissionsList = this.originalPermissionList.filter((contact: any) =>
      contact.appointments?.some(
        (appointment: any) =>
          appointment.statusFlag === 0 &&
          appointment.designation?.toLowerCase() === this.designation.value.toLowerCase()
      )
    );

  }else{
    this.permissionsList = [...this.originalPermissionList];

  }

}

onClearFilters(){
  this.clearFilterSearch()
  this.clearSearch();
  this.designation.setValue(null);
  this.filteredContactOptions = [...this.originalPermissionList];
}

openPermissionGroupsDialog(){
  const _dialogConfig = new MatDialogConfig();
  _dialogConfig.panelClass = 'mcv-fullscreen-dialog';
  this.dialog.open(PermissionGroupDialogComponent, _dialogConfig);
}

openPhotoDialog(member: any ) {
            this.dialog.open(ContactPhotoNameDialogComponent, {
              data: member
            });
          }
}
