'use strict';
import { numberDefined } from 'UTILS';

export class NumberValidation {

    static numberFromString(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : 0;
        return numberDefined(value) ? value : 0;
    }

    static boundaryValue(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : undefined;
        return numberDefined(value) ? value : undefined;
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
        return NumberValidation.valueInBoundariesWhenBoundaries(value, min, max) ;
    }

    static valueInBoundariesWhenBoundaries(value = 0, min, max) {
        const lessThanMin = NumberValidation.lessThanMin(value, min);
        const greaterThanMax = NumberValidation.greaterThanMax(value, max);
        return !lessThanMin && !greaterThanMax;
    }

    static lessThanMin(value, min) {
        return numberDefined(min) && value < min ? true : false;
    }

    static greaterThanMax(value, max) {
        return numberDefined(max) && max < value ? true : false;
    }

    static equalToBoundary(value, boundaryValue) {
        return value === boundaryValue;
    }

}
