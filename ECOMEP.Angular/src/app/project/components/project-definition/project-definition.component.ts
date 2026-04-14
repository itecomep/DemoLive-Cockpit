import { Component, inject, Input, OnInit } from "@angular/core";

import { Project } from "../../models/project.model";
import { McvActivityListComponent } from "../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component";
import { NgFor, DecimalPipe, CurrencyPipe, DatePipe, CommonModule } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import {  MatIconModule } from "@angular/material/icon";
import { Contact } from "src/app/contact/models/contact";
import { ProjectApiService } from "../../services/project-api.service";
import { ContactDialogComponent } from "src/app/contact/components/contact-dialog/contact-dialog.component";
import { MatDialog, MatDialogConfig, MatDialogModule } from "@angular/material/dialog";

@Component({
    selector: 'app-project-definition',
    templateUrl: './project-definition.component.html',
    styleUrls: ['./project-definition.component.scss'],
    standalone: true,
    imports: [
      MatExpansionModule,
      CommonModule, 
      MatChipsModule, 
      NgFor, 
      McvActivityListComponent, 
      DecimalPipe, 
      CurrencyPipe, 
      DatePipe,
      MatIconModule,
      MatDialogModule
    ]
})
export class ProjectDefinitionComponent implements OnInit
{
  private readonly projectApiService = inject(ProjectApiService);
  private readonly dialog = inject(MatDialog);
  currentEntity: Project = new Project();

  @Input('currentEntity') set configValue(value: Project)
  {
    if (value)
    {
      this.currentEntity = value;
      this.setAssociationConfig();
      // console.log(this.currentEntity);
    }
  }

  get isPermissionBillingView() { return this.projectApiService.isPermissionBillingView; }

  ngOnInit(): void
  {

  }

  associationConfig: any;
  private setAssociationConfig()
  {
    this.associationConfig = {
      isReadOnly: true,
      project: this.currentEntity,
      associations: this.currentEntity.associations,
      updateDatabase: false
    };
  }

  openContactDialog(contact:Contact){
    const dialogConfig = new MatDialogConfig();
      // dialogConfig.panelClass = 'mcv-fullscreen-dialog';
    
    dialogConfig.autoFocus = true;
    dialogConfig.data = contact;

    const _dialogRef= this.dialog.open(ContactDialogComponent, dialogConfig);
  }
}