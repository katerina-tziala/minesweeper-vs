"use strict";

// import { TYPOGRAPHY } from "~/_constants/typography.constants.js";

// export const clone = (itemToClone) => {
//   return JSON.parse(JSON.stringify(itemToClone));
// };

// export const sortNumbersArrayAsc = (arrayToSort) => {
//   return [...arrayToSort].sort((itemA, itemB) => {
//     return itemA - itemB;
//   });
// };

// export const randomValueFromArray = (arrayToChooseFrom) => {
//   const maxNumber = arrayToChooseFrom.length;
//   let randomIndex = Math.round(Math.random() * maxNumber);
//   randomIndex = randomIndex >= maxNumber ? 0 : randomIndex;
//   return arrayToChooseFrom[randomIndex];
// };

// export const preventInteraction = (event) => {
//   event.preventDefault();
//   event.stopPropagation();
// };

export const replaceStringParameter = (stringToUpdate, value, replacePart = '###') => {
  return stringToUpdate.replace(replacePart, value);
};

// export const extractIdValue = (elementId) => {
//   return elementId.split(TYPOGRAPHY.doubleUnderscore).pop();
// };

// export const roundUpToNextDecade = (number) => {
//   return Math.ceil(parseInt(number) / 10) * 10;
// };

// export const uniqueArray = (arrayToClear) => {
//   return Array.from(new Set(arrayToClear));
// };

// export const arrayDifference = (arrayToFilter, arrayReference) => {
//   return arrayToFilter.filter((item) => !arrayReference.includes(item));
// };

// export const arrayIntersection = (arrayToFilter, arrayReference) => {
//   return arrayToFilter.filter((item) => arrayReference.includes(item));
// };

// export const enumKey = (enumObject, value) => {
//   return Object.keys(enumObject).find((key) => enumObject[key] === value);
// };

// export const keysFromMapByValue = (map, searchValue) => {
//   return [...map.entries()]
//     .filter(({ 1: v }) => v === searchValue)
//     .map(([k]) => k);
// };

// export const isOdd = (num) => {
//   return num % 2 === 0 ? false : true;
// };

// export const timeoutPromise = (milliSeconds = 500, value) => {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve(value), milliSeconds));
// };

// export const randomFromRange = (from, to) => {
//   return Math.round(Math.random() * (to - from + 1) + from);
// };

// export const maxFromArray = (array) => {
//   if (!array || !array.length) {
//     return undefined;
//   }
//   return Math.max(...array);
// };

// export const minFromArray = (array) => {
//   if (!array || !array.length) {
//     return undefined;
//   }
//   return Math.min(...array);
// };
