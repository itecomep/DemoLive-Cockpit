import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable, startWith, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-mcv-tag-editor',
  templateUrl: './mcv-tag-editor.component.html',
  styleUrls: ['./mcv-tag-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatOptionModule,
    AsyncPipe,
  ]
})
export class McvTagEditorComponent implements OnInit
{
  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  //testing
  fruitCtrl = new FormControl('');
  filteredFruits!: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];
  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  tags: string[] = [];
  @Input('tags') set tagsValue(value: any)
  {
    if (value)
    {
      this.tags = value;
      if (!this.tags)
      {
        this.tags = [];
      }
    }

    if (!this.isPermissionEdit)
    {
      this.tagFC.disable();
    }
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagFC = new FormControl('', [Validators.required, Validators.minLength(3)]);
  categoryFC = new FormControl();
  filteredOptions$!: Observable<any[]>;

  @Input() isPermissionEdit: boolean = false;
  @Input() tagOptions: string[] = [];
  @Input() tagColorClass!: string;

  @Output() update = new EventEmitter<any>()

  constructor(
    private utilityService: UtilityService
  )
  {

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  ngOnInit(): void
  {

    this.registerSuggestionsOnValueChange();
  }

  displaySelectedValue(option?: string): string
  {
    return option ? option : '';
  }

  getErrorMessage(control: AbstractControl)
  {
    return this.utilityService.getErrorMessage(control);
  }

  onAdd(event: MatChipInputEvent): void
  {
    if(this.isPermissionEdit){

      const input = event.input;
      const value = event.value;
  
      // Add our fruit
      if ((value || '').trim())
      {
        this.tags.push(value.trim());
        this.update.emit(this.tags);
      }
  
      // Reset the input value
      if (input)
      {
        input.value = '';
      }
  
      this.tagFC.setValue(null);
    }
  }

  onRemove(fruit: string): void
  {
      const index = this.tags.indexOf(fruit);
      if (index >= 0)
      {
        this.tags.splice(index, 1);
        this.update.emit(this.tags);
    }
  }



  onSelected(event: MatAutocompleteSelectedEvent): void
  {
    if(this.isPermissionEdit){
      this.tags.push(event.option.viewValue);
      this.update.emit(this.tags);
      this.tagInput.nativeElement.value = '';
      this.tagFC.setValue(null);
    }
  }

  private registerSuggestionsOnValueChange()
  {
    this.filteredOptions$ = this.tagFC.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith<string | any>(""),
      map(value => value ? (typeof value === "string" ? value : value) : null),
      map(name => (name ? this.filterOptions(name as string) : this.tagOptions.slice()))
    );
  }

  private filterOptions(property: string): any[]
  {
    return this.tagOptions.filter(option => option ? option.toLowerCase().includes(property.toLowerCase()) : false);
  }

  add(event: MatChipInputEvent): void
  {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value)
    {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void
  {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0)
    {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void
  {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[]
  {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}

