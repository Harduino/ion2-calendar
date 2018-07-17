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
    cycle: [ 'less', 'more', 'on' ],

    // will be automatically computed
    index: {},
    firstName: '',
    lastName: '',
    lastIndex: 0
};
for( let i = 0;i < multi4.cycle.length;i++ ) {
    let name = multi4.cycle[i];
    multi4.index[name] = i;
}
multi4.firstName = multi4.cycle[0];
multi4.lastIndex = multi4.cycle.length-1;
multi4.lastName = multi4.cycle[multi4.lastIndex];

export { multi4 };
