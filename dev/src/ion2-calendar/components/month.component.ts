import { Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDay, CalendarMonth, CalendarOriginal, PickMode } from '../calendar.model'
import { defaults, pickModes, multi4 } from "../config";

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar-month',
  providers: [MONTH_VALUE_ACCESSOR],
  template: `
    <div [class]="color">
      <ng-template [ngIf]="!_isRange" [ngIfElse]="rangeBox">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + getMulti4Class(day.time) + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{day.title}}</p>
                  <small *ngIf="day.subTitle">{{day?.subTitle}}</small>
                  <img *ngIf="getMulti4Type(day.time) == 'lunch'" src="assets/imgs/sun.png" />
                  <img *ngIf="getMulti4Type(day.time) == 'dinner'" src="assets/imgs/moon.png" />
                  <ng-container *ngIf="getMulti4Type(day.time) == 'all'">
                      <img src="assets/imgs/sun.png" />
                      <img src="assets/imgs/moon.png" />
                  </ng-container>
                </button>
              </ng-container>
            </div>
          </ng-template>
        </div>
      </ng-template>

      <ng-template #rangeBox>
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days"
                 [class.startSelection]="isStartSelection(day)"
                 [class.endSelection]="isEndSelection(day)"
                 [class.is-first-wrap]="day?.isFirst"
                 [class.is-last-wrap]="day?.isLast"
                 [class.between]="isBetween(day)">
              <ng-container *ngIf="day">
                <button type='button'
                        [class]="'days-btn ' + getMulti4Class(day.time) + day.cssClass"
                        [class.today]="day.isToday"
                        (click)="onSelected(day)"
                        [class.marked]="day.marked"
                        [class.last-month-day]="day.isLastMonth"
                        [class.next-month-day]="day.isNextMonth"
                        [class.is-first]="day.isFirst"
                        [class.is-last]="day.isLast"
                        [class.on-selected]="isSelected(day.time)"
                        [disabled]="day.disable">
                  <p>{{day.title}}</p>
                  <small *ngIf="day.subTitle">{{day?.subTitle}}</small>
                  <img *ngIf="getMulti4Type(day.time) == 'lunch'" src="assets/imgs/sun.png" />
                  <img *ngIf="getMulti4Type(day.time) == 'dinner'" src="assets/imgs/moon.png" />
                  <ng-container *ngIf="getMulti4Type(day.time) == 'all'">
                      <img src="assets/imgs/sun.png" />
                      <img src="assets/imgs/moon.png" />
                  </ng-container>
                </button>
              </ng-container>

            </div>
          </ng-template>
        </div>
      </ng-template>
    </div>
  `
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {

  @Input() month: CalendarMonth;
  @Input() pickMode: PickMode;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() readonly = false;
  @Input() color: string = defaults.COLOR;

  @Output() onChange: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output() onChange4: EventEmitter<any> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _date: Array<CalendarDay | null> = [null, null];
  _dateStates = {};
  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  get _isRange(): boolean {
    return this.pickMode === pickModes.RANGE
  }

  constructor(public ref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  writeValue(obj: any): void {
    this._dateStates = {};
    if (Array.isArray(obj)) {
      this._date = obj;

      for( let i = 0;i < this._date.length;i++ ) {
        let dateItem = this._date[i];
        if( dateItem && typeof dateItem['state'] != 'undefined' ) {
          this._dateStates[ dateItem['time'] ] = dateItem['state'];
        }
      }
    }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  trackByTime(index: number, item: CalendarOriginal): number {
    return item ? item.time : index;
  }

  isEndSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[1] === null) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  isBetween(day: CalendarDay): boolean {
    if (!day) return false;

    if (this.pickMode !== pickModes.RANGE || !this._isInit) {
      return false;
    }

    if (this._date[0] === null || this._date[1] === null) {
      return false;
    }

    const start = this._date[0].time;
    const end = this._date[1].time;

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[0] === null) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {

    if (Array.isArray(this._date)) {

      if (this.pickMode !== pickModes.MULTI) {
        if (this.pickMode == pickModes.MULTI4) {
          return false;
        }

        if (this._date[0] !== null) {
          return time === this._date[0].time
        }

        if (this._date[1] !== null) {
          return time === this._date[1].time
        }
      } else {
        return this._date.findIndex(e => e !== null && e.time === time) !== -1;
      }

    } else {
      return false;
    }
  }

  getMulti4Class(time) {
    if( this._dateStates[time] ) {
      return `multi4-${this._dateStates[time]}`;
    } else {
      return '';
    }
  }

  getMulti4Type(time) {
    if( this._dateStates[time] ) {
      return this._dateStates[time];
    } else {
      return '';
    }
  }

  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onSelect.emit(item);
    if (this.pickMode === pickModes.SINGLE) {
      this._date[0] = item;
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.RANGE) {
      if (this._date[0] === null) {
        this._date[0] = item;
        this.onSelectStart.emit(item);
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.onSelectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.onSelectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.onSelectStart.emit(item);
        }
      } else {
        this._date[0] = item;
        this.onSelectStart.emit(item);
        this._date[1] = null;
      }
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.MULTI ) {

      const index = this._date.findIndex(e => e !== null && e.time === item.time);
      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.onChange.emit(this._date.filter(e => e !== null));
    }

    if( this.pickMode === pickModes.MULTI4 ) {
        const index = this._date.findIndex(e => e !== null && e.time === item.time);

        if (index === -1) {
          this._date.push(item);
          this._dateStates[item.time] = multi4.firstName;
        } else {
            if( !this._dateStates[item.time] ) {
                this._dateStates[item.time] = multi4.lastName;
            }

            if( this._dateStates[item.time] == multi4.lastName ) {
              this._date.splice(index, 1);
              if( typeof this._dateStates[item.time] != 'undefined' ) {
                  delete this._dateStates[item.time];
              }
            } else {
              let currentStateName = this._dateStates[item.time];
              let nextStateIndex = multi4.index[currentStateName] < multi4.lastIndex ? multi4.index[currentStateName]+1 : multi4.lastIndex
              let nextStateName = multi4.cycle[nextStateIndex];
              this._dateStates[item.time] = nextStateName;
            }
        }

        let dates =  this._date.filter(e => e !== null)
        let res = new Array();
        for( let i = 0;i < dates.length;i++ ) {
            let date = dates[i];
            if( this._dateStates[date.time] ) {
                res.push({
                    date:  date,
                    state: this._dateStates[date.time]
                });
            }
        }
        this.onChange4.emit( res );
    }
  }

}
