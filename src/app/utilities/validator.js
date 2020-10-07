'use strict';

import { TYPOGRAPHY } from './constants/typography.constants.js';

export class Validator {

    static isEmptyString(value) {
        return (value === TYPOGRAPHY.emptyString || value.replace(/\s+/, TYPOGRAPHY.emptyString) === TYPOGRAPHY.emptyString) ? true : false;
    }

    static isValidNumber(value) {
        return (!isNaN(value) && value !== null);
    }

    static isValueInLimits(value, limits) {
        return (limits.min <= value && value <= limits.max);
    }
}
