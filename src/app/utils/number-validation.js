'use strict';
import { valueDefined } from 'UTILS';

export class NumberValidation {
    static numberDefined(value) {
        return valueDefined(value) && !isNaN(value) ? true : false;
    }

    static numberFromString(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : 0;
        return NumberValidation.numberDefined(value) ? value : 0;
    }

    static boundaryValue(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : undefined;
        return NumberValidation.numberDefined(value) ? value : undefined;
    }

    static getValueInBoundaries(value = 0, min, max) {
        if (NumberValidation.lessThanMin(value, min)) {
            return min;
        }
        return NumberValidation.greaterThanMax(value, max) ? max : value;
    }

    static valueInBoundaries(value = 0, min, max) {
        if (!min && !max) {
            return true;
        }
        return NumberValidation.valueInBoundariesWhenBoundaries(value, min, max);
    }

    static valueInBoundariesWhenBoundaries(value = 0, min, max) {
        const lessThanMin = NumberValidation.lessThanMin(value, min);
        const greaterThanMax = NumberValidation.greaterThanMax(value, max);
        return !lessThanMin && !greaterThanMax;
    }

    static lessThanMin(value, min) {
        return NumberValidation.numberDefined(min) && value < min ? true : false;
    }

    static greaterThanMax(value, max) {
        return NumberValidation.numberDefined(max) && max < value ? true : false;
    }

    static equalToBoundary(value, boundaryValue) {
        return value === boundaryValue;
    }

}
