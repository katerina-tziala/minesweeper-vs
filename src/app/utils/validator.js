'use strict';

export function definedString(value) {
  return valueDefined(value) && value.length;
};

export function valueDefined(value) {
  return value !== undefined && value !== null;
};

export function numberDefined(value) {
  return valueDefined(value) && !isNaN(value);
};


export function valueInRange(value, range) {
  return range[0] <= value && value < range[1];
};