'use strict';

export function replaceStringParameter(stringToUpdate, value, replacePart = '###') {
  return stringToUpdate.replace(replacePart, value);
};

export function parseBoolean(stringToParse) {
  return (stringToParse === 'false' || stringToParse === 'true') ? JSON.parse(stringToParse) : false;
};

export function getNextPositionInArray(arrayList = [], currentIndex = 0, step = 1) {
  const maxPosition = lastPositionInArray(arrayList);
  const newPosition = currentIndex + step;
  if (newPosition > maxPosition) {
    return 0;
  }
  return newPosition < 0 ? maxPosition : newPosition;
};

export function lastPositionInArray(arrayList = []) {
  return arrayList.length ? arrayList.length - 1 : 0;
};

export function enumKey(enumObject, value) {
  return Object.keys(enumObject).find((key) => enumObject[key] === value);
};

export function randomInteger(maxNumber) {
  const value = Math.round(Math.random() * maxNumber);
  return value > maxNumber ? 0 : value;
};

export function sortNumbersArrayAsc(arrayToSort) {
  return [...arrayToSort].sort((itemA, itemB) => itemA - itemB);
};

export function arrayDifference(arrayToFilter, arrayReference) {
  return arrayToFilter.filter((item) => !arrayReference.includes(item));
};

export function uniqueArrayValues(arrayToCheck) {
  return Array.from(new Set(arrayToCheck));
};

export function isOddNumber(num) {
  return num % 2 === 0 ? false : true;
};

export function convertedTimeParts(value) {
  const actual = Math.floor(value / 60);
  const remainder = value % 60;
  return [actual, remainder];
};

export function secondsToTimeObject(secondsToConvert = 0) {
  const [allMinutes, s] = convertedTimeParts(secondsToConvert);
  const [h, m] = convertedTimeParts(allMinutes);
  return { h, m, s };
};

export function roundTo(value = 0, decimals = 2) {
  return parseFloat(value.toFixed(decimals));
};

