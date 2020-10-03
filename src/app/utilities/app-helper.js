'use strict';

import { Typography } from './constants/typography.constants.js';

export class AppHelper {

    static clone(itemToClone) {
        return JSON.parse(JSON.stringify(itemToClone));
    }

    static sortNumbersArrayAsc(arrayToSort) {
        return [...arrayToSort].sort((itemA, itemB) => { return itemA - itemB; });
    }

    static getRandomValueFromArray(arrayToChooseFrom) {
        return arrayToChooseFrom[Math.floor(Math.random() * arrayToChooseFrom.length)];
    }

    static preventInteraction(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    static replaceStringParameter(stringToUpdate, value, replacePart = Typography.tripleHashtag) {
        return stringToUpdate.replace(replacePart, value);
    }

    static isDefined(valueToCheck) {
        return valueToCheck !== undefined && valueToCheck !== null;
    }

}
