"use strict";

import { TYPOGRAPHY } from "./constants/typography.constants.js";

export const clone = (itemToClone) => {
	return JSON.parse(JSON.stringify(itemToClone));
};

export const sortNumbersArrayAsc = (arrayToSort) => {
	return [...arrayToSort].sort((itemA, itemB) => { return itemA - itemB; });
};

export const getRandomValueFromArray = (arrayToChooseFrom) => {
	return arrayToChooseFrom[Math.floor(Math.random() * arrayToChooseFrom.length)];
};

export const preventInteraction = (event) => {
	event.preventDefault();
	event.stopPropagation();
};

export const replaceStringParameter = (stringToUpdate, value, replacePart = TYPOGRAPHY.tripleHashtag) => {
	return stringToUpdate.replace(replacePart, value);
};
