import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatDialogModule,
  MatDialogRef,
  MatDialog,
} from "@angular/material/dialog";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ContactApiService } from "src/app/contact/services/contact-api.service";
import {
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
} from "rxjs";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { PermissionGroup } from "../../models/permissionGroup.model";
import { PermissionGroupService } from "../../services/permission-group.service";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { PermissionGroupCreateComponent } from "../permission-group-create/permission-group-create.component";
import { PermissionGroupUpdateComponent } from "../permission-group-update/permission-group-update.component";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { UserPermissionGroupMapService } from "../../services/user-permission-group-map.service";
import { UserPermissionGroupMap } from "../../models/userPermissionGroupMap.model";
import { ContactPhotoNameDialogComponent } from "src/app/shared/components/contact-photo-name-dialog/contact-photo-name-dialog.component";

@Component({
  selector: "app-permission-group-dialog",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  templateUrl: "./permission-group-dialog.component.html",
  styleUrls: ["./permission-group-dialog.component.scss"],
})
export class PermissionGroupDialogComponent {
  permissionGroups: PermissionGroup[] = [];
  selectedGroup!: PermissionGroup;
  roleCodes: string[] = [];
  rolesData: any[] = [];
  contactOptions: any[] = [];
  selectedMembers: any[] = [];
  contactFC = new FormControl<any>(null);
  filteredContacts$!: Observable<any[]>;
  userPermissionGroupMaps : UserPermissionGroupMap[]=[]
  constructor(
    private dialogRef: MatDialogRef<PermissionGroupDialogComponent>,
    private entityService: PermissionGroupService,
    private dialog: MatDialog,
    private utilityService: UtilityService,
    private authService: AuthService,
    private contactService: ContactApiService,
    private userPermissionGroupMapService: UserPermissionGroupMapService
  ) {}

  async ngOnInit() {
    await this.getRoles();
    await this.getContacts();
    await this.getUserPermissionGroupMaps();
    await this.getPermissionGroups();
    this.filteredContacts$ = this.contactFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((value) =>
        value ? (typeof value === "string" ? value : value.name) : null
      ),
      map((name) =>
        name ? this.filterContacts(name as string) : this.contactOptions.slice()
      )
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  async getPermissionGroups() {
    this.permissionGroups = await firstValueFrom(this.entityService.get([]));
    if (this.permissionGroups.length > 0) {
      await this.selectGroup(this.permissionGroups[0]);
    }
  }

  async selectGroup(group: PermissionGroup) {
    this.selectedGroup = group;
    this.roleCodes = group.roleCodes || [];
    this.filterMembersForSelectedGroup();
  }

  async getRoles() {
    this.rolesData = await firstValueFrom(this.authService.getRoles());
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(PermissionGroupCreateComponent, {
      width: "600px",
      data: { rolesData: this.rolesData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.permissionGroups.push(result);
      }
    });
  }

  editGroup(event: Event, group: PermissionGroup) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(PermissionGroupUpdateComponent, {
      width: "600px",
      data: { rolesData: this.rolesData, permissionGroup: group },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.permissionGroups.findIndex(g => g.id === group.id);
        if (index !== -1) {
          this.permissionGroups[index] = result;
          if (this.selectedGroup?.id === group.id) {
            this.selectGroup(result);
          }
        }
      }
    });
  }

  async deleteGroup(event: Event, group: PermissionGroup) {
    this.utilityService.showConfirmationDialog(
      `You want to delete this permission group?`,
      async () => {
        event.stopPropagation();
        await firstValueFrom(this.entityService.delete(group.id));
        this.permissionGroups = this.permissionGroups.filter(
          (x) => x.id !== group.id
        );
        this.selectedMembers = [];
        if (this.permissionGroups.length > 0) {
          await this.selectGroup(this.permissionGroups[0]);
        }
      }
    );
  }

  getRoleDescription(roleCode: string): string {
    const role = this.rolesData.find((r) => r.name === roleCode);
    return role?.description || roleCode;
  }

  getRoleModule(roleCode: string): string {
    const role = this.rolesData.find((r) => r.name === roleCode);
    return role?.module || roleCode;
  }

  filterContacts(property: string): any[] {
    return this.contactOptions.filter((option) =>
      option
        ? option.name.toLowerCase().includes(property.toLowerCase())
        : false
    );
  }

  displayFnContact(option?: any): string {
    return option ? option.name : "";
  }

  async onSelectContact(event: MatAutocompleteSelectedEvent) {
    if (
      event &&
      !this.selectedMembers.find((m) => m.id === event.option.value.id) &&
      this.selectedGroup
    ) {
      const contact = event.option.value;
      const payload = {
        userID: contact.id,
        permissionGroupID: this.selectedGroup.id,
      };
      const _response = await firstValueFrom(this.userPermissionGroupMapService.create(payload));
      this.selectedMembers.push(contact);
      this.userPermissionGroupMaps.push(_response);
      this.contactFC.reset();
    }
  }

  async removeMemberFromList(member: any) {
    if (this.selectedGroup) {
      const userMap = this.userPermissionGroupMaps.find(
        (map: UserPermissionGroupMap) => map.userID === member.id && map.permissionGroupID === this.selectedGroup.id
      );
      if (userMap) {
        await firstValueFrom(this.userPermissionGroupMapService.delete(userMap.id));
        this.userPermissionGroupMaps = this.userPermissionGroupMaps.filter(m => m.id !== userMap.id);
      }
    }
    this.selectedMembers = this.selectedMembers.filter(
      (m) => m.id !== member.id
    );
  }

  async getContacts() {
    const filters = [
      { key: "IsAppointed", value: "true" },
      { key: "AppointmentStatusFlag", value: "0" },
    ];
    this.contactOptions = await firstValueFrom(
      this.contactService.get(filters)
    );
  }

  async getUserPermissionGroupMaps() {
    this.userPermissionGroupMaps = await firstValueFrom(
      this.userPermissionGroupMapService.get()
    );
  }

  filterMembersForSelectedGroup() {
    if (this.selectedGroup) {
      const filteredMaps = this.userPermissionGroupMaps.filter(
        (map: any) => map.permissionGroupID === this.selectedGroup.id
      );
      console.log('filteredMaps',this.userPermissionGroupMaps,this.selectedGroup.id);
      console.log('filteredMaps',filteredMaps);
      const _usersMaps = filteredMaps.map((map: any) => map.userID);
      this.selectedMembers = [];
      _usersMaps.forEach(userId => {
        const contact = this.contactOptions.find(c => c.id === userId);
        if (contact) {
          this.selectedMembers.push(contact);
        }
      });
      console.log('this.selectedMembers',this.selectedMembers);
    }
  }

  openPhotoDialog(member: any ) {
      this.dialog.open(ContactPhotoNameDialogComponent, {
        data: member
      });
    }
}
