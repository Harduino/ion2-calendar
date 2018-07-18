"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = {
    DATE_FORMAT: 'YYYY-MM-DD',
    COLOR: 'primary',
    WEEKS_FORMAT: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    MONTH_FORMAT: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
};
exports.pickModes = {
    SINGLE: 'single',
    RANGE: 'range',
    MULTI: 'multi',
    MULTI4: 'multi4'
};
var multi4 = {
    cycle: ['lunch', 'dinner', 'all'],
    // will be automatically computed
    index: {},
    firstName: '',
    lastName: '',
    lastIndex: 0
};
exports.multi4 = multi4;
for (var i = 0; i < multi4.cycle.length; i++) {
    var name_1 = multi4.cycle[i];
    multi4.index[name_1] = i;
}
multi4.firstName = multi4.cycle[0];
multi4.lastIndex = multi4.cycle.length - 1;
multi4.lastName = multi4.cycle[multi4.lastIndex];
//# sourceMappingURL=config.js.map