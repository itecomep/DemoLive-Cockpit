import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class McvTimeLineDateUtilityService {

  constructor(private datePipe: DatePipe) { }

  getHoursFromTimeString(value: string): number {
    return parseInt(value.split(':')[0], 10);
  }

  getMinutesFromTimeString(value: string): number {
    return parseInt(value.split(':')[1], 10);
  }

  setTimeFromString(date: Date, value: string): Date {
    const hours = value.split(':')[0];
    const mins = value.split(':')[1];
    const newdate = new Date(date);
    newdate.setHours(parseInt(hours, 10));
    newdate.setMinutes(parseInt(mins, 10));
    newdate.setSeconds(0);
    newdate.setMilliseconds(0);
    return new Date(newdate);
  }

  getTimeAsString(date: Date, minutesGap: number = 1): string {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    let mins = newDate.getMinutes();
    if (minutesGap > 1) {
      mins = Math.floor(Math.floor(mins / minutesGap) * minutesGap);
    }
    return this.numberToString(hours, 2) + ':' + this.numberToString(mins, 2);
  }

  getHoursBetween(start: Date, end: Date) {
    const _start = new Date(start);
    const _end = new Date(end);
    if (_start.getTime() < _end.getTime()) {
      return this.getMilisecondsToHours(_end.getTime() - _start.getTime());
    }
    return 0;
  }

  getHoursToMiliseconds(hours: number) {
    let _hours = hours * 60 * 60 * 1000;
    // console.log('Hours',_hours);

    let _minutes = hours / (1000 / 60) % 60;
    // console.log('Minutes',_minutes);

    // console.log('HourMinutes',Math.floor(_hours + _minutes));
    return Math.floor(_hours + _minutes);
  }

  getMilisecondsToHours(miliseconds: number) {
    return miliseconds / 60 / 60 / 1000;
  }

  getSnapWidth(value: number, snap: number = 1) {
    return Math.ceil(value / snap) * snap;
  }

  addHoursToDate(date: Date, hours: number, isAppend: boolean = false): Date {
    // tslint:disable-next-line: prefer-const
    let d = new Date(date);
    if (!isAppend) {
      d.setHours(0, 0, 0, 0);
    }
    d.setTime(d.getTime() + this.getHoursToMiliseconds(hours));
    return d;
  }

  numberToString(value: number, digits: number = 1): string {
    let s = value + '';
    while (s.length < digits) { s = '0' + s; }
    return s;
  }

  getRandomInt(min: number = 0, max: number = 100): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getWeekDates(date: Date): Date[] {
    // tslint:disable-next-line: prefer-const
    let curr = new Date(date);
    // tslint:disable-next-line: prefer-const
    let week = [];
    for (let i = 0; i < 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first));
      week.push(day);
    }
    return week;
  }

  getWeekStart(date?: Date): Date {
    // tslint:disable-next-line: prefer-const
    let curr = date ? new Date(date) : new Date(); // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    curr.setDate(first);
    return curr;
  }

  getWeekEnd(date?: Date): Date {
    // tslint:disable-next-line: prefer-const
    let curr = date ? new Date(date) : new Date(); // get current date
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const last = first + 6; // last day is the first day + 6
    curr.setDate(last);
    return curr;
  }

  getMonthStart(date?: Date): Date {
    const curr = date ? new Date(date) : new Date(); // get current date
    // tslint:disable-next-line: prefer-const
    let d = new Date(curr.getFullYear(), curr.getMonth(), 1);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }

  getMonthEnd(date?: Date): Date {
    const curr = date ? new Date(date) : new Date(); // get current date
    // tslint:disable-next-line: prefer-const
    let d = new Date(curr.getFullYear(), curr.getMonth() + 1, 0);
    // d.setHours(curr.getHours());
    // d.setMinutes(curr.getMinutes());
    return d;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    // tslint:disable-next-line: prefer-const
    let d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    // tslint:disable-next-line: prefer-const
    let d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    return d1.getTime() === d2.getTime();
  }


  isSameMonth(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getMonth() === d2.getMonth();
  }
}
