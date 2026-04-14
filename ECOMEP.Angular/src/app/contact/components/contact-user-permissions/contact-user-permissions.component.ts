import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { RegisterDialogComponent } from 'src/app/auth/components/register-dialog/register-dialog.component';
import { ResetPasswordDialogComponent } from 'src/app/auth/components/reset-password-dialog/reset-password-dialog.component';
import { RoleDto } from 'src/app/auth/models/role-dto';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Contact } from '../../models/contact';
import { ContactApiService } from '../../services/contact-api.service';
import { McvGroupByPipe } from '../../../shared/pipes/mcv-group-by.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-contact-user-permissions',
    templateUrl: './contact-user-permissions.component.html',
    styleUrls: ['./contact-user-permissions.component.scss'],
    standalone: true,
    providers: [
      McvGroupByPipe
    ],
    imports: [CommonModule, MatExpansionModule, MatButtonModule, MatTooltipModule, MatCheckboxModule, McvGroupByPipe]
})
export class ContactUserPermissionsComponent implements OnInit
{
  isInitializing: boolean = false;
  contact!: Contact;
  roles: RoleDto[] | any = [];
  userRoles: string[] = [];
  isEmployeeRegistered = false;

  @Input('contact') set setValue(contact: Contact)
  {
    this.contact = contact;
    this.isEmployeeRegistered = false;
    if (contact && contact.username)
    {
      this.isEmployeeRegistered = true;
      this.fetchUserRoles();
      this.rolesByUsername();
    }
  }

  get isPermissionEdit(): boolean
  {
    return this.entityService.isPermissionUserManagement;
  }

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private utilityService: UtilityService,
    private entityService: ContactApiService,
    private myElement: ElementRef,
  ) { }

  ngOnInit()
  {
  }


  reset()
  {
    this.isEmployeeRegistered = false;
    this.roles = [];
  }

  private async rolesByUsername() {
    if(this.contact.username){
      this.userRoles = await firstValueFrom(this.authService.getRolesByUsername(this.contact.username));
      // console.log(this.userRoles);
    }
  }

  haveMasterPermission() {
    const _isMaster = this.userRoles.includes('MASTER');
    if (_isMaster) {
      return true
    } else {
      return false;
    }
  }
  
  private async fetchUserRoles()
  {

    this.roles = await firstValueFrom(await this.authService
      .getRoleOptionsByUsername(this.contact.username as string));
  }

  public async onRegisterButtonClicked()
  {
    // let popupWidth = "70%";
    // if (window.screen.width < 600) {
    //   popupWidth = "90%";
    // }

    if (this.contact && this.contact.id)
    {
      const dialogRef = this.dialog.open(RegisterDialogComponent, {
        data: {
          contactID: this.contact.id
        }
      });

      var result = await firstValueFrom(dialogRef.afterClosed());
      if (result)
      {
        this.contact.username = result;
        await firstValueFrom(this.entityService.update(this.contact));
        this.isEmployeeRegistered = true;
        this.fetchUserRoles();
      }

    } else
    {
      // TODO: handle exception that employee that need to be created is not available
    }
  }

  onResetPasswordClick()
  {

    if (this.contact && this.contact.username)
    {


      const dialogRef = this.dialog.open(ResetPasswordDialogComponent, {
        data: {
          username: this.contact.username,
        }
      });

      dialogRef.afterClosed().subscribe(result =>
      {
        if (result)
        {

        }
      });
    } else
    {
      // TODO: handle exception that employee that need to be created is not available
    }
  }

  onRemoveClick()
  {
    if (this.contact.username)
    {
      this.authService.delete(this.contact.username).subscribe(
        res =>
        {
          this.utilityService.showSwalToast('Success', 'User removed successfully.');
          this.contact.username = undefined;
          this.entityService.update(this.contact).subscribe(
            res => { }
          )
          this.isEmployeeRegistered = false;
        }
      );
    }
  }

  onRoleChanged(event: MatCheckboxChange, previlege: RoleDto)
  {
    let obServiceCall;
    if (event.checked)
    {
      obServiceCall = this.authService.addRoles(
        this.contact.username as string,
        [previlege.name]
      );
    } else
    {
      obServiceCall = this.authService.removeRoles(
        this.contact.username as string,
        [previlege.name]
      );
    }

    obServiceCall.subscribe(
      res =>
      {
        this.utilityService.showSwalToast('Success', 'Permission updated successfully');
        // this.fetchUserRoles();
      },
      err =>
      {
        this.fetchUserRoles();
      }
    );
  }

  onSelect(index: number)
  {
    let el = this.myElement.nativeElement.querySelector(`#permissiondropdown${index}`);
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  /************** Role checkbox listener end ****************************/

  onSave()
  {
    this.utilityService.showSwalToast('Success', 'Permissions saved successfully.');
  }
}
