export const defaults = {
  DATE_FORMAT: 'YYYY-MM-DD',
  COLOR: 'primary',
  WEEKS_FORMAT: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  MONTH_FORMAT: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
};

export const pickModes = {
  SINGLE: 'single',
  RANGE: 'range',
  MULTI: 'multi',
  MULTI4: 'multi4'
};

var multi4 = {
    states: {
        cycle: [ 'lunch', 'dinner', 'all' ],
        index: {},
        firstName: '',
        lastName: '',
        lastIndex: 0,
    },
    confirms: {
        cycle: [ 'unconfirmed', 'confirmed' ],
        index: {},
        firstName: '',
        lastName: '',
        lastIndex: 0,
    }
};
for( let multi4Name in multi4 ) {
    let multi4Obj = multi4[multi4Name];
    for( let i = 0;i < multi4Obj.cycle.length;i++ ) {
        let name = multi4Obj.cycle[i];
        multi4Obj.index[name] = i;
    }
    multi4Obj.firstName = multi4Obj.cycle[0];
    multi4Obj.lastIndex = multi4Obj.cycle.length-1;
    multi4Obj.lastName = multi4Obj.cycle[multi4Obj.lastIndex];
}
export { multi4 };
