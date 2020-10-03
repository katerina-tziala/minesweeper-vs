'use strict';
import { Typography } from './constants/typography.constants.js';

export class Validator {

    static isEmptyString(value) {
        return (value === Typography.emptyString || value.replace(/\s+/, Typography.emptyString) === Typography.emptyString) ? true : false;
    }

    static isValidNumber(value) {
        return (!isNaN(value) && value !== null);
    }

    static isValueInLimits(value, limits) {
        return (limits.min <= value && value <= limits.max);
    }
}
