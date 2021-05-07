'use strict';
import { valueDefined } from 'UTILS';

export default class NumberValidation {

    static numberFromString(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : 0;
        return valueDefined(value) ? value : 0;
    }

    static boundaryValue(stringNumber) {
        const value = stringNumber ? parseInt(stringNumber, 10) : undefined;
        return valueDefined(value) ? value : undefined;
    }


    static getValueInBoundaries(value = 0, min, max) {
        if (NumberValidation.#lessThanMin(value, min)) {
            return min;
        }
        return NumberValidation.#greaterThanMax(value, max) ? max : value;
    }

    static #lessThanMin(value, min) {
        return valueDefined(min) && value < min ? true : false;
    }

    static #greaterThanMax(value, max) {
        return valueDefined(max) && max < value ? true : false;
    }

    static equalToBoundary(value, boundaryValue) {
        return value === boundaryValue;
    }

}
