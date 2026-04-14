import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, NativeDateModule, MatRippleModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from "@angular/material/expansion";
import { APP_DATE_FORMATS, CustomDateAdapter } from '../helpers/CustomDateAdapter';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatTabsModule,
    MatSortModule,
    MatRippleModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    TextFieldModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSliderModule
  ],
  exports: [
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatRadioModule,
    MatTabsModule,
    MatSortModule,
    MatRippleModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatProgressSpinnerModule,
    TextFieldModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSliderModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' },
    { provide: MAT_DATE_LOCALE, useValue: "en-IN" },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {
        subscriptSizing: 'dynamic',
      }
    }
  ],
})
export class MaterialImportModule { }
