import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

// extend NativeDateAdapter's format method to specify the date format.
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter
{
  override getFirstDayOfWeek(): number
  {
    return 1;
  }

  override format(date: Date, displayFormat: Object): string
  {
    const month_names = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    // Return the format as per your requirement
    return `${day} ${month_names[month]} ${year}`;
  }

  // If required extend other NativeDateAdapter methods.
}


