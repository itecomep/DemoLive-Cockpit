import * as uuid from 'uuid';
import swal from 'sweetalert2';
import { DatePipe, Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Clipboard } from '@angular/cdk/clipboard';

import { AppConfig } from "src/app/app.config";
import { AbstractControl } from "@angular/forms";
import { CityOption, CountryCode, StateCode } from 'src/app/shared/models/locations';

@Injectable({
  providedIn: 'root'
})
export class UtilityService
{
  constructor(
    private config: AppConfig,
    private http: HttpClient,
    private datePipe: DatePipe,
    private location: Location,
    private clipboard: Clipboard
  ) { }

  shareURL(url: string)
  {
    if (navigator.share)
    {
      // Use the Web Share API if available
      navigator
        .share({
          title: 'Share this URL',
          url: url,
        })
        .then(() =>
        {
          console.log('Shared successfully');
        })
        .catch((error) =>
        {
          console.error('Sharing failed:', error);
        });
    } else
    {
      // Fallback for browsers that don't support Web Share API
      const shareableURL = url;
      const shareText = `Check out this URL: ${shareableURL}`;

      // Check if the Clipboard API is available
      if (navigator.clipboard)
      {
        navigator.clipboard.writeText(shareableURL).then(() =>
        {
          console.log('URL copied to clipboard:', shareableURL);
        }).catch((error) =>
        {
          console.error('Copy to clipboard failed:', error);
        });
      } else
      {
        // Fallback for browsers that don't support Clipboard API
        // You can implement your own custom sharing dialog here.
        // For simplicity, we'll log the shareText to the console as a fallback.
        console.log(shareText);
        this.showSwalToast("Incompatible browser", "Please use a modern browser to share this URL");
      }
    }
  }

  shareFileOrBlob(fileOrBlob: File | Blob)
  {
    if (navigator.share)
    {
      // Convert Blob to File if it's a Blob
      const fileToShare = fileOrBlob instanceof Blob ? new File([fileOrBlob], 'sharedFile') : fileOrBlob;

      navigator
        .share({
          files: [fileToShare],
        })
        .then(() =>
        {
          console.log('Shared successfully');
        })
        .catch((error) =>
        {
          console.error('Sharing failed:', error);
        });
    } else
    {
      // Fallback for browsers that don't support Web Share API
      // You can implement your own sharing logic here.
      // For simplicity, we'll log a message as a fallback.
      console.log('Sharing not supported in this browser.');
      this.showSwalToast("Incompatible browser", "Please use a modern browser to share this URL");
    }
  }


  setTimeFromString(date: Date, value: string): Date
  {
    const hours = value.split(':')[0];
    const mins = value.split(':')[1];
    const newdate = new Date(date);
    newdate.setHours(parseInt(hours, 10));
    newdate.setMinutes(parseInt(mins, 10));
    newdate.setSeconds(0);
    newdate.setMilliseconds(0);
    return new Date(newdate);
  }

  copyText(textToCopy: string)
  {
    this.clipboard.copy(textToCopy);
    this.showSwalToast("Copied!", "Copied to Clipboard.");
  }

  get yesterday()
  {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(0, 0, 0);
    return d;
  }

  get today()
  {
    const d = new Date();
    d.setHours(0, 0, 0);
    return d;
  }

  get tomorrow()
  {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0);
    return d;
  }

  get isMobileView(): boolean
  {
    return window.innerWidth < this.config.MOBILE_BREAKPOINT_SCREEN_WIDTH;
  }

  locationBack()
  {
    this.location.back();
  }

  getUrlWithApi(url: string): string
  {
    return url ? this.config.apiEndpoint + '/' + url : '';
  }

  generateGUID()
  {
    return uuid.v4();
  }

  formatDate(date: Date, format: string): string
  {
    const formattedDate = this.datePipe.transform(date, format);
    return formattedDate !== null ? formattedDate : '';
  }

  getLocalDate(date: Date): Date
  {
    return new Date(new Date(date).setMinutes(330));
  }

  getNextDay(date: Date, resetTime: boolean = false): Date
  {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    if (resetTime)
    {
      next.setHours(0, 0, 0, 0);
    }
    return new Date(next);
  }

  getPreviousDay(date: Date, resetTime: boolean = false): Date
  {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    if (resetTime)
    {
      prev.setHours(0, 0, 0, 0);
    }
    return new Date(prev);
  }

  setTimeValue(date: Date, value: string): Date
  {
    const hours = value.split(':')[0];
    const mins = value.split(':')[1];
    const newdate = new Date(date);
    newdate.setHours(parseInt(hours, 10));
    newdate.setMinutes(parseInt(mins, 10));
    newdate.setSeconds(0);
    return new Date(newdate);
  }

  getTimeValue(date: Date, minutesGap: number = 1): string
  {

    const newDate = new Date(date);
    const hours = newDate.getHours();
    let mins = newDate.getMinutes();
    // console.log('time',hours,mins,minutesGap);
    if (minutesGap > 1)
    {
      mins = Math.floor(Math.floor(mins / minutesGap) * minutesGap);

    }
    // console.log('value',this.NumberToString(hours,2)+':'+this.NumberToString(mins,2));
    return this.NumberToString(hours, 2) + ':' + this.NumberToString(mins, 2);
  }

  convertToUTCDate(date: Date): Date
  {
    // tslint:disable-next-line: prefer-const
    let d = new Date(date);
    d.setMinutes(-330);
    return d;
  }

  NumberToString(value: number, digits: number = 1): string
  {
    let s = value + '';
    while (s.length < digits) { s = '0' + s; }
    return s;
  }

  getErrorMessage(control?: AbstractControl): string
  {
    if (!control)
    {
      return '';
    }
    return control.hasError('required')
      ? 'Required'
      : control.hasError('email')
        ? 'Invalid Email'
        : control.hasError('number')
          ? 'Invalid Number'
          : control.hasError('date')
            ? 'Invalid Date'
            : (control.hasError('minlength') && control.errors != null)
              ? 'Min Length allowed ' + control.errors["minlength"].requiredLength
              : (control.hasError('maxlength') && control.errors != null)
                ? 'Max Length allowed ' + control.errors["maxlength"].requiredLength
                : (control.hasError('min') && control.errors != null)
                  ? 'Min Value allowed ' + control.errors["min"].min
                  : (control.hasError('max') && control.errors != null)
                    ? 'Max Value allowed ' + control.errors["max"].max
                    : (control.hasError('matDatepickerMin') && control.errors != null)
                      ? 'Min Date allowed ' + this.formatDate(control.errors["matDatepickerMin"].min, this.config.DATE_FORMAT)
                      : (control.hasError('matDatepickerMax') && control.errors != null)
                        ? 'Max Date allowed ' + this.formatDate(control.errors["matDatepickerMax"].max, this.config.DATE_FORMAT)
                        : (control.hasError('matDatepickerFilter') && control.errors != null)
                          ? 'Invalid Date'
                          : '';
  }

  getCityOptions()
  {
    return this.http.get<CityOption[]>('assets/mock-data/cities.json');
  }

  getCountryCodes()
  {
    return this.http.get<CountryCode[]>('assets/mock-data/countries.json');
  }

  getStateGSTINCodes()
  {
    return this.http.get<StateCode[]>('assets/mock-data/GST-STATECODE.json');
  }

  dateFilterDateAfter(d: Date, cursorDate: Date): boolean
  {
    if (d < cursorDate)
    {
      return false;
    }

    return true;
  }

  dateFilterNotDayOfWeek(d: Date, dayWeek: number): boolean
  {
    // Prevent Saturday and Sunday from being selected.
    if (d.getDay() === dayWeek)
    {
      return false;
    }

    return true;
  }

  DateDiffInDays(date1: Date, date2: Date): number
  {
    // Get 1 day in milliseconds
    const msPerDay = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    const msDate1 = date1.getTime();
    const msDate2 = date2.getTime();

    // Calculate the difference in milliseconds
    const msDifference = msDate2 - msDate1;

    // Convert back to days and return
    return Math.round(msDifference / msPerDay);
  }



  showSwalToast(title: string, text: string, icon: 'success' | 'warning' | 'error' | 'info' = 'success', timer = 3000)
  {
    swal.fire({
      title,
      text,
      icon,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer
    });
  }

  showSweetDialog(title: string, text: string, icon: 'success' | 'warning' | 'error' | 'info' = 'success')
  {
    swal.fire({
      title,
      text,
      icon,
      showConfirmButton: true
    });
  }

  showConfirmationDialog(text: string, onYes: () => void)
  {
    swal.fire({
      title: 'Are you sure?',
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'CANCEL',
    }).then(result =>
    {
      if (result.value)
      {
        if (onYes && typeof onYes === 'function')
        {
          onYes();
        }
      } else if (result.dismiss === swal.DismissReason.cancel)
      {
        swal.fire({
          title: 'Cancel!',
          text: 'Your Action Cancelled.',
          icon: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  showConfirmationDialogAsync(text: string, onYes: () => Promise<void>): Promise<void>
  {
    return new Promise<void>((resolve, reject) =>
    {
      swal.fire({
        title: 'Are you sure?',
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'CANCEL',
      }).then(async (result) =>
      {
        if (result.isConfirmed)
        {
          if (onYes && typeof onYes === 'function')
          {
            try
            {
              await onYes();
              resolve(); // Resolve the Promise when the async operation is done
            } catch (error)
            {
              reject(error); // Reject the Promise if there's an error in onYes
            }
          } else
          {
            resolve(); // Resolve the Promise if onYes is not provided or not a function
          }
        } else if (result.dismiss === swal.DismissReason.cancel)
        {
          swal.fire({
            title: 'Cancel!',
            text: 'Your Action Cancelled.',
            icon: 'warning',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
          });
          resolve(); // Resolve the Promise when the user cancels
        } else
        {
          reject('Unknown result'); // Reject the Promise for unknown results
        }
      });
    });
  }

  isValidEmail(email: string): boolean
  {
    let isValidEmail = false;

    if (email && email.length > 0 && email.includes('@'))
    {
      const emailComponents: string[] = email.split('@');

      if (emailComponents[0] && emailComponents[1] &&
        emailComponents[0].length > 0 &&
        emailComponents[1].length > 0 &&
        emailComponents[1].includes('.')
      )
      {
        const emailDomainComponents = emailComponents[1].split('.');

        if (emailDomainComponents[0] && emailDomainComponents[1] &&
          emailDomainComponents[0].length > 0 &&
          emailDomainComponents[1].length > 0
        )
        {
          isValidEmail = true;
        }
      }
    }

    return isValidEmail;
  }

  getEmailsFromEmailColonString(csvString: string): any[]
  {
    const emailRecipients: any[] = new Array();

    if (csvString && csvString.length > 0)
    {
      const emails = csvString.split(',');

      if (emails && emails.length > 0)
      {
        emails.forEach(emailStr =>
        {
          if (this.isValidEmail(emailStr))
          {
            const emailRecipient = {
              email: emailStr
            };
            emailRecipients.push(emailRecipient);
          }
        });
      }
    }
    return emailRecipients;
  }

  getEmailColonStringFromEmails(emails: any[]): string
  {
    let csvString: string = '';
    if (emails && emails.length > 0)
    {
      emails.forEach((recipient: any) =>
      {
        csvString += recipient.email + ',';
      });
    }
    return csvString;
  }

  getRandomInt(min: number = 0, max: number = 100): number
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getWeekDates(date: Date): Date[]
  {
    // tslint:disable-next-line: prefer-const
    let curr = new Date(date);
    // tslint:disable-next-line: prefer-const
    let week = [];
    for (let i = 1; i <= 7; i++)
    {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first));
      week.push(day);
    }
    return week;
  }

  getWeekStart(date: Date): Date
  {
    // tslint:disable-next-line: prefer-const
    let curr = new Date(date); // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    curr.setDate(first);
    return curr;
  }

  getWeekEnd(date: Date): Date
  {
    // tslint:disable-next-line: prefer-const
    let curr = new Date(date); // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    curr.setDate(last);
    return curr;
  }

  updatePagedList<T>(sourceList: T[], targetList: T[], property: string | string[]): T[]
  {
    sourceList.forEach((obj: any) =>
    {
      const index = targetList.findIndex((e: any) =>
      {
        if (typeof property === 'string')
        {
          return e[property] === obj[property];
        } else
        {
          if (property)
          {
            property.forEach((p: any) =>
            {
              if (e[p] !== obj[p]) { return false; } return
            });
          }
          return true;
        }
      });
      if (index === -1)
      {
        targetList.push(obj);
      } else
      {
        targetList[index] = obj;
      }
    });
    return targetList.map(x => Object.assign({}, x));
  }

  groupBy(array: any, key: any)
  {
    // Return the end result
    return array.reduce((result: any, currentValue: any) =>
    {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  }
  getMonthStart(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    // tslint:disable-next-line: prefer-const
    let d = new Date(curr.getFullYear(), curr.getMonth(), 1);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }

  getMonthEnd(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    // tslint:disable-next-line: prefer-const
    let d = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }
  getQuarter(date?: Date): number
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    const month = curr.getMonth();
    return month >= 3 ? Math.floor(month / 3) : 4;
  }
  getQuarterStart(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    const month = curr.getMonth();
    let d = new Date(curr.getFullYear(), Math.floor(month / 3) * 3, 1);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }
  getQuarterEnd(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    const month = curr.getMonth();
    let d = new Date(curr.getFullYear(), (Math.floor(month / 3) * 3) + 3, 0);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }

  getFYearStart(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    const month = curr.getMonth();
    let d = new Date(((month + 1) <= 3) ? curr.getFullYear() - 1 : curr.getFullYear(), Math.floor(month / 3) * 3, 1);
    d.setMonth(3);
    // d.setMinutes(curr.getMinutes());
    return d;
  }
  getFYearEnd(date?: Date): Date
  {
    const curr = date ? new Date(date) : new Date(); // get current date
    const month = curr.getMonth();
    let d = new Date(((month + 1) <= 3) ? curr.getFullYear() : curr.getFullYear() + 1, (Math.floor(month / 3) * 3) + 3, 0);
    d.setMonth(2);
    // d.setMinutes(curr.getMinutes());
    return d;
  }

  getCurrencyFormat(input: number, fraction: number = 1): string
  {
    const currencySymbol = '₹';
    // var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!

    const result = (input.toFixed(fraction)).toString().split('.');

    let lastThree = result[0].substring(result[0].length - 3);
    const otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers != '')
    {
      lastThree = ',' + lastThree;
    }
    let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

    if (result.length > 1)
    {
      output += '.' + result[1];
    }

    return currencySymbol + ' ' + output;
    // return formatCurrency(
    //   Math.round(value),
    //   'en-IN',
    //   getCurrencySymbol('INR', 'wide','en-IN'),
    //   null,
    //   '1.0-0'
    // );
    // return `${Math.round(value).toLocaleString()} ₹`;
  }

  getFYear(last: number = 0): number
  {
    let current_year = new Date(new Date().setFullYear(new Date().getFullYear() - last)).getFullYear();
    let current_month = new Date().getMonth() + 1;
    if (current_month < 4)
    {
      return current_year - 1;
    } else
    {
      return current_year;
    }
  }

  getLastYearOptions(last: number = 5)
  {
    let _options = [];
    for (let i = 1; i <= last; i++)
    {
      _options.push({
        label: 'Last ' + i.toString() + ' Year' + (i > 1 ? 's' : ''),
        value: i
      });
    }
    return _options;

  }

  getFYearOptions(last: number = 10)
  {
    let _options = [];
    for (let i = 0; i < 10; i++)
    {
      _options.push({
        label: this.getFYear(i).toString() + '-' + (this.getFYear(i) + 1).toString(),
        value: i
      });
    }
    return _options;
  }

  getPeriodOptions(period: 'Quarterly' | 'Half Yearly')
  {

    // tslint:disable-next-line: prefer-const
    let options = [];
    if (period === 'Half Yearly')
    {
      options.push({
        label: 'Apr-Sep',
        value: 4,
      });
      options.push({
        label: 'Oct-Mar',
        value: 10,
      });
    } else
    {
      options.push({
        label: 'Apr-Jun',
        value: 4,
      });
      options.push({
        label: 'Jul-Sep',
        value: 7,
      });
      options.push({
        label: 'Oct-Dec',
        value: 10,
      });
      options.push({
        label: 'Jan-Mar',
        value: 1,
      });
    }

    return options;
  }

  getYearOptions(last: number = 10)
  {
    let current_year = new Date().getFullYear();

    let _options = [];
    for (let i = 0; i < 10; i++)
    {
      _options.push({
        label: (current_year - i).toString(),
        value: (current_year - i)
      });

    }
    return _options;
  }

  getMonthOptions()
  {
    return [
      {
        label: 'JAN', value: 1
      },
      {
        label: 'FEB', value: 2
      },
      {
        label: 'MAR', value: 3
      },
      {
        label: 'APR', value: 4
      },
      {
        label: 'MAY', value: 5
      },
      {
        label: 'JUN', value: 6
      },
      {
        label: 'JUL', value: 7
      },
      {
        label: 'AUG', value: 8
      },
      {
        label: 'SEP', value: 9
      },
      {
        label: 'OCT', value: 10
      },
      {
        label: 'NOV', value: 11
      },
      {
        label: 'DEC', value: 12
      },
    ];

  }

  getQuarterOptions()
  {
    return [
      {
        label: 'Q1', value: 0
      },
      {
        label: 'Q2', value: 1
      },
      {
        label: 'Q3', value: 2
      },
      {
        label: 'Q4', value: 3
      }
    ];

  }

  getHourDifference(start: Date, end: Date)
  {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }

  getMonthsByPeriod(period: 'Monthly' | 'Yearly' | 'Quarterly' | 'Half Yearly'): number
  {
    switch (period.toLowerCase())
    {
      case 'monthly': return 1;
      case 'quarterly': return 3;
      case 'half yearly': return 6;
      case 'yearly': return 12;
      default: return 1;
    }
  }

  /**
   * To get the monthname
   * @param month
   * @param isShort
   * @returns Name of the month
   */
  getMonthName(month: number, isShort: boolean = false)
  {
    //An array containing the name of each month.
    var months = [
      "January", "February", "March", "April", "May",
      "June", "July", "August", "September", "October",
      "November", "December"];
    return (isShort ? months[month] : months[month].slice(0, 3));
  }


  getFileExtension(filename: string)
  {
    return filename ? filename.substring((filename.lastIndexOf('.') + 1)).toLowerCase() : '';

  }

  getFileMediaType(filename: string)
  {
    let _fileExtension = this.getFileExtension(filename);
    if (_fileExtension === 'mp4' || _fileExtension === 'avi')
    {
      return 'video';
    } else if (_fileExtension === 'jpg' || _fileExtension === 'jpeg' || _fileExtension === 'png' || _fileExtension === 'gif')
    {
      return 'image';
    } else if (_fileExtension === 'mp3')
    {
      return 'audio';
    }
    else
    {
      return 'other'
    }
  }

  addLeadingZeros(number: number, totalLength: number)
  {
    return String(number).padStart(totalLength, '0');
  }

  getInitialsFromString(value: string)
  {
    const splitStr = value.split(' ');
    if (splitStr.length > 1)
    {
      return (splitStr[0].charAt(0) + splitStr[1].charAt(0)).toUpperCase();
    } else
    {
      return (value.charAt(0) + value.charAt(1)).toUpperCase();
    }
  }
}
