"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var calendar_model_1 = require("../calendar.model");
var config_1 = require("../config");
exports.MONTH_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return MonthComponent; }),
    multi: true
};
var MonthComponent = /** @class */ (function () {
    function MonthComponent(ref) {
        this.ref = ref;
        this.readonly = false;
        this.color = config_1.defaults.COLOR;
        this.onChange = new core_1.EventEmitter();
        this.onChange4 = new core_1.EventEmitter();
        this.onSelect = new core_1.EventEmitter();
        this.onSelectStart = new core_1.EventEmitter();
        this.onSelectEnd = new core_1.EventEmitter();
        this._date = [null, null];
        this._dateStates = {};
        this._isInit = false;
    }
    Object.defineProperty(MonthComponent.prototype, "_isRange", {
        get: function () {
            return this.pickMode === config_1.pickModes.RANGE;
        },
        enumerable: true,
        configurable: true
    });
    MonthComponent.prototype.ngAfterViewInit = function () {
        this._isInit = true;
    };
    MonthComponent.prototype.writeValue = function (obj) {
        this._dateStates = {};
        if (Array.isArray(obj)) {
            this._date = obj;
            for (var i = 0; i < this._date.length; i++) {
                var dateItem = this._date[i];
                if (dateItem && typeof dateItem['state'] != 'undefined') {
                    this._dateStates[dateItem['time']] = dateItem['state'];
                }
            }
        }
    };
    MonthComponent.prototype.registerOnChange = function (fn) {
        this._onChanged = fn;
    };
    MonthComponent.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    MonthComponent.prototype.trackByTime = function (index, item) {
        return item ? item.time : index;
    };
    MonthComponent.prototype.isEndSelection = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== config_1.pickModes.RANGE || !this._isInit || this._date[1] === null) {
            return false;
        }
        return this._date[1].time === day.time;
    };
    MonthComponent.prototype.isBetween = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== config_1.pickModes.RANGE || !this._isInit) {
            return false;
        }
        if (this._date[0] === null || this._date[1] === null) {
            return false;
        }
        var start = this._date[0].time;
        var end = this._date[1].time;
        return day.time < end && day.time > start;
    };
    MonthComponent.prototype.isStartSelection = function (day) {
        if (!day)
            return false;
        if (this.pickMode !== config_1.pickModes.RANGE || !this._isInit || this._date[0] === null) {
            return false;
        }
        return this._date[0].time === day.time && this._date[1] !== null;
    };
    MonthComponent.prototype.isSelected = function (time) {
        if (Array.isArray(this._date)) {
            if (this.pickMode !== config_1.pickModes.MULTI) {
                if (this.pickMode == config_1.pickModes.MULTI4) {
                    return false;
                }
                if (this._date[0] !== null) {
                    return time === this._date[0].time;
                }
                if (this._date[1] !== null) {
                    return time === this._date[1].time;
                }
            }
            else {
                return this._date.findIndex(function (e) { return e !== null && e.time === time; }) !== -1;
            }
        }
        else {
            return false;
        }
    };
    MonthComponent.prototype.getMulti4Class = function (time) {
        if (this._dateStates[time]) {
            return "multi4-" + this._dateStates[time];
        }
        else {
            return '';
        }
    };
    MonthComponent.prototype.getMulti4Type = function (time) {
        if (this._dateStates[time]) {
            return this._dateStates[time];
        }
        else {
            return '';
        }
    };
    MonthComponent.prototype.onSelected = function (item) {
        if (this.readonly)
            return;
        item.selected = true;
        this.onSelect.emit(item);
        if (this.pickMode === config_1.pickModes.SINGLE) {
            this._date[0] = item;
            this.onChange.emit(this._date);
            return;
        }
        if (this.pickMode === config_1.pickModes.RANGE) {
            if (this._date[0] === null) {
                this._date[0] = item;
                this.onSelectStart.emit(item);
            }
            else if (this._date[1] === null) {
                if (this._date[0].time < item.time) {
                    this._date[1] = item;
                    this.onSelectEnd.emit(item);
                }
                else {
                    this._date[1] = this._date[0];
                    this.onSelectEnd.emit(this._date[0]);
                    this._date[0] = item;
                    this.onSelectStart.emit(item);
                }
            }
            else {
                this._date[0] = item;
                this.onSelectStart.emit(item);
                this._date[1] = null;
            }
            this.onChange.emit(this._date);
            return;
        }
        if (this.pickMode === config_1.pickModes.MULTI) {
            var index = this._date.findIndex(function (e) { return e !== null && e.time === item.time; });
            if (index === -1) {
                this._date.push(item);
            }
            else {
                this._date.splice(index, 1);
            }
            this.onChange.emit(this._date.filter(function (e) { return e !== null; }));
        }
        if (this.pickMode === config_1.pickModes.MULTI4) {
            var index = this._date.findIndex(function (e) { return e !== null && e.time === item.time; });
            if (index === -1) {
                this._date.push(item);
                this._dateStates[item.time] = config_1.multi4.firstName;
            }
            else {
                if (!this._dateStates[item.time]) {
                    this._dateStates[item.time] = config_1.multi4.lastName;
                }
                if (this._dateStates[item.time] == config_1.multi4.lastName) {
                    this._date.splice(index, 1);
                    if (typeof this._dateStates[item.time] != 'undefined') {
                        delete this._dateStates[item.time];
                    }
                }
                else {
                    var currentStateName = this._dateStates[item.time];
                    var nextStateIndex = config_1.multi4.index[currentStateName] < config_1.multi4.lastIndex ? config_1.multi4.index[currentStateName] + 1 : config_1.multi4.lastIndex;
                    var nextStateName = config_1.multi4.cycle[nextStateIndex];
                    this._dateStates[item.time] = nextStateName;
                }
            }
            var dates = this._date.filter(function (e) { return e !== null; });
            var res = new Array();
            for (var i = 0; i < dates.length; i++) {
                var date = dates[i];
                if (this._dateStates[date.time]) {
                    res.push({
                        date: date,
                        state: this._dateStates[date.time]
                    });
                }
            }
            this.onChange4.emit(res);
        }
    };
    MonthComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ion-calendar-month',
                    providers: [exports.MONTH_VALUE_ACCESSOR],
                    template: "\n    <div [class]=\"color\">\n      <ng-template [ngIf]=\"!_isRange\" [ngIfElse]=\"rangeBox\">\n        <div class=\"days-box\">\n          <ng-template ngFor let-day [ngForOf]=\"month.days\" [ngForTrackBy]=\"trackByTime\">\n            <div class=\"days\">\n              <ng-container *ngIf=\"day\">\n                <button type='button'\n                        [class]=\"'days-btn ' + getMulti4Class(day.time) + day.cssClass\"\n                        [class.today]=\"day.isToday\"\n                        (click)=\"onSelected(day)\"\n                        [class.marked]=\"day.marked\"\n                        [class.last-month-day]=\"day.isLastMonth\"\n                        [class.next-month-day]=\"day.isNextMonth\"\n                        [class.on-selected]=\"isSelected(day.time)\"\n                        [disabled]=\"day.disable\">\n                  <p>{{day.title}}</p>\n                  <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                  <img *ngIf=\"getMulti4Type(day.time) == 'lunch'\" src=\"assets/imgs/sun.png\" />\n                  <img *ngIf=\"getMulti4Type(day.time) == 'dinner'\" src=\"assets/imgs/moon.png\" />\n                  <ng-container *ngIf=\"getMulti4Type(day.time) == 'all'\">\n                      <img src=\"assets/imgs/sun.png\" />\n                      <img src=\"assets/imgs/moon.png\" />\n                  </ng-container>\n                </button>\n              </ng-container>\n            </div>\n          </ng-template>\n        </div>\n      </ng-template>\n\n      <ng-template #rangeBox>\n        <div class=\"days-box\">\n          <ng-template ngFor let-day [ngForOf]=\"month.days\" [ngForTrackBy]=\"trackByTime\">\n            <div class=\"days\"\n                 [class.startSelection]=\"isStartSelection(day)\"\n                 [class.endSelection]=\"isEndSelection(day)\"\n                 [class.is-first-wrap]=\"day?.isFirst\"\n                 [class.is-last-wrap]=\"day?.isLast\"\n                 [class.between]=\"isBetween(day)\">\n              <ng-container *ngIf=\"day\">\n                <button type='button'\n                        [class]=\"'days-btn ' + getMulti4Class(day.time) + day.cssClass\"\n                        [class.today]=\"day.isToday\"\n                        (click)=\"onSelected(day)\"\n                        [class.marked]=\"day.marked\"\n                        [class.last-month-day]=\"day.isLastMonth\"\n                        [class.next-month-day]=\"day.isNextMonth\"\n                        [class.is-first]=\"day.isFirst\"\n                        [class.is-last]=\"day.isLast\"\n                        [class.on-selected]=\"isSelected(day.time)\"\n                        [disabled]=\"day.disable\">\n                  <p>{{day.title}}</p>\n                  <small *ngIf=\"day.subTitle\">{{day?.subTitle}}</small>\n                  <img *ngIf=\"getMulti4Type(day.time) == 'lunch'\" src=\"assets/imgs/sun.png\" />\n                  <img *ngIf=\"getMulti4Type(day.time) == 'dinner'\" src=\"assets/imgs/moon.png\" />\n                  <ng-container *ngIf=\"getMulti4Type(day.time) == 'all'\">\n                      <img src=\"assets/imgs/sun.png\" />\n                      <img src=\"assets/imgs/moon.png\" />\n                  </ng-container>\n                </button>\n              </ng-container>\n\n            </div>\n          </ng-template>\n        </div>\n      </ng-template>\n    </div>\n  "
                },] },
    ];
    /** @nocollapse */
    MonthComponent.ctorParameters = function () { return [
        { type: core_1.ChangeDetectorRef, },
    ]; };
    MonthComponent.propDecorators = {
        "month": [{ type: core_1.Input },],
        "pickMode": [{ type: core_1.Input },],
        "isSaveHistory": [{ type: core_1.Input },],
        "id": [{ type: core_1.Input },],
        "readonly": [{ type: core_1.Input },],
        "color": [{ type: core_1.Input },],
        "onChange": [{ type: core_1.Output },],
        "onChange4": [{ type: core_1.Output },],
        "onSelect": [{ type: core_1.Output },],
        "onSelectStart": [{ type: core_1.Output },],
        "onSelectEnd": [{ type: core_1.Output },],
    };
    return MonthComponent;
}());
exports.MonthComponent = MonthComponent;
//# sourceMappingURL=month.component.js.map