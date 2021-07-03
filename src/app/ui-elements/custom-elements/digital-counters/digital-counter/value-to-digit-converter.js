'use strict';
import { NumberValidation } from 'UTILS';

function getFillValueOutOfBoundaries(value, max) {
    if (NumberValidation.greaterThanMax(value, max)) {
        return 'above-max';
    }
    return 'bellow-min';
}

function getConversionParams(value, min, max) {
    const inBoundaries = NumberValidation.valueInBoundaries(value, min, max);
    let fill, valueToConvert;
    if (inBoundaries) {
        valueToConvert = Math.abs(value).toString();
    } else {
        fill = getFillValueOutOfBoundaries(value, max)
    }
    return { valueToConvert, fill };
}

function convertValueInArray(valueString = '', numberOfDigits = 0, fillValue = '0') {
    const valueArray = valueString ? valueString.split('') : [];
    while (valueArray.length < numberOfDigits) {
        valueArray.unshift(fillValue);
    }
    return valueArray;
}

function valueLength(value) {
    return value ? value.toString().length : 0;
}

export function getValueArray(value, min, max) {
    if (!value) {
        return [];
    }
    const digitsLength = numberOfDigits(min, max);
    const { valueToConvert, fill } = getConversionParams(value, min, max);
    const valueArray = convertValueInArray(valueToConvert, digitsLength, fill);
    if (value < 0) {
        valueArray[0] = 'minus';
    }
    return valueArray;
}

export function numberOfDigits(min, max) {
    const minLength = valueLength(min);
    const maxLength = valueLength(max);
    const range = [minLength, maxLength]
    return Math.max(...range);
}
