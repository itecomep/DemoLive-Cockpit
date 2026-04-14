import { Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, take } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectApiService } from '../../services/project-api.service';
import { ProjectNote } from '../../models/project-note.model';
import { ProjectNoteApiService } from '../../services/project-note-api.service';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { McvActivityListComponent } from '../../../mcv-activity/components/mcv-activity-list/mcv-activity-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-project-notes',
    templateUrl: './project-notes.component.html',
    styleUrls: ['./project-notes.component.scss'],
    standalone: true,
    imports: [MatExpansionModule, NgFor, NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatButtonModule, McvActivityListComponent, DatePipe]
})
export class ProjectNotesComponent implements OnInit
{
  @ViewChild('autosize') protected autosize!: CdkTextareaAutosize;
  form: any;
  get f(): any { return this.form.controls; }

  get isMobileView(): boolean { return this.utilityService.isMobileView; }

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  project!: Project;
  notes: ProjectNote[] = [];
  updateDatabase: boolean = false;

  @Input('config') set configValue(value: {
    isReadOnly: boolean,
    project: Project,
    notes: ProjectNote[],
    updateDatabase: boolean
  })
  {
    if (value)
    {
      this.project = value.project;
      this.notes = value.notes;
      this.updateDatabase = value.updateDatabase;
      this.refresh();
    }
  }
  get isPermissionEdit() { return this.projectService.isPermissionNotesEdit; }
  @Output() update = new EventEmitter<ProjectNote[]>();

  constructor(
    private notesService: ProjectNoteApiService,
    private projectService: ProjectApiService,
    private utilityService: UtilityService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
  ) { }

  ngOnInit()
  {
    this.buildForm();
  }
  touchForm()
  {
    //touch form inputs to show validation messages
    if (this.form)
    {
      Object.keys(this.form.controls).forEach(field =>
      {
        // {1}
        const control = this.form.get(field); // {2}
        control.markAsTouched({ onlySelf: true }); // {3}
      });
    }
  }

  resetForm()
  {
    if (this.form)
    {
      this.form.reset();
    }
  }

  triggerResize()
  {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable
      .pipe(take(1))
      .subscribe(() => { if (this.autosize) { this.autosize.resizeToFitContent(true) } });
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }
  refresh()
  {
    if (this.notes.length == 0)
    {
      this.getProjectNotes();
    }
  }
  async getProjectNotes()
  {
    this.notes = await firstValueFrom(this.notesService.get([{ key: 'ProjectID', value: this.project.id.toString() }], ''));
  }
  buildForm()
  {
    this.form = this.formBuilder.group({
      notes: new FormControl<any>("", { nonNullable: true, validators: [Validators.required] }),
    });
  }


  onCreate()
  {


    let obj = new ProjectNote();

    obj.notes = this.f['notes'].value;
    obj.projectID = this.project.id;

    if (this.updateDatabase)
    {

      this.notesService.create(obj).subscribe(
        (data: any) =>
        {
          if (data)
          {
            this.notes.push(data);
            this.notes.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
          }
          this.utilityService.showSwalToast(
            "Success!",
            "Save Successfull.",
          );
          this.form.reset();
          this.update.emit(this.notes);
        }
      );
    } else
    {
      this.notes.push(obj);
      this.notes.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      this.update.emit(this.notes);
    }
  }

  onDelete(obj: ProjectNote)
  {
    if (obj)
    {
      if (this.updateDatabase)
      {
        this.notesService.delete(obj.id).subscribe(
          () =>
          {
            this.notes = this.notes.filter(x => x.id !== obj.id);
            this.utilityService.showSwalToast(
              "Success!",
              "Delete Successfull.",
            );
            this.update.emit(this.notes);
          }
        );
      } else
      {
        this.notes = this.notes.filter(x => x.id !== obj.id);
        this.update.emit(this.notes);
      }
    }
  }
}

