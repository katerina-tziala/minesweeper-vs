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




// export function debounce(func, wait, immediate) {
// 	var timeout;
// 	return function() {
// 		var context = this, args = arguments;
// 		var later = function() {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		var callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// };


// export function debounce(func, timeout = 300) {
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => { func.apply(this, args); }, timeout);
//   };
// }



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




// export const extractIdValue = (elementId) => {
//   return elementId.split(TYPOGRAPHY.doubleUnderscore).pop();
// };

// export const roundUpToNextDecade = (number) => {
//   return Math.ceil(parseInt(number) / 10) * 10;
// };

// export const uniqueArray = (arrayToClear) => {
//   return Array.from(new Set(arrayToClear));
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
