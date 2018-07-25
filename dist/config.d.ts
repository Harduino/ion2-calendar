export declare const defaults: {
    DATE_FORMAT: string;
    COLOR: string;
    WEEKS_FORMAT: string[];
    MONTH_FORMAT: string[];
};
export declare const pickModes: {
    SINGLE: string;
    RANGE: string;
    MULTI: string;
    MULTI4: string;
};
declare var multi4: {
    states: {
        cycle: string[];
        index: {};
        firstName: string;
        lastName: string;
        lastIndex: number;
    };
    confirms: {
        cycle: string[];
        index: {};
        firstName: string;
        lastName: string;
        lastIndex: number;
    };
};
export { multi4 };
