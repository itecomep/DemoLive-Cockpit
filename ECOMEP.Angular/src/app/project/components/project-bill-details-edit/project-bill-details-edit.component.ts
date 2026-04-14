import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProjectDefinitionUpdateComponent } from '../project-definition-update/project-definition-update.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProjectApiService } from '../../services/project-api.service';

@Component({
  selector: 'app-project-bill-details-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './project-bill-details-edit.component.html',
  styleUrls: ['./project-bill-details-edit.component.scss']
})
export class ProjectBillDetailsEditComponent extends ProjectDefinitionUpdateComponent {

  projectApiService = inject(ProjectApiService);

  get isPermissionView() { return this.projectApiService.isPermissionBillingView; }
  override get isPermissionEdit() { return this.projectApiService.isPermissionBillingEdit; }
}
