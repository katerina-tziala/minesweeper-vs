'use strict';

export function definedString(value) {
  return valueDefined(value) && value.length ? true : false;
};

export function valueDefined(value) {
  return value !== 'undefined' && value !== 'null' ? true : false;
};

export function numberDefined(value) {
  return valueDefined(value) && !isNaN(value) ? true : false;
};


export function valueInRange(value, range) {
  return range[0] <= value && value < range[1] ? true : false;
};