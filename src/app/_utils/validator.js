"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";

export const emptyString = (value) => {
  return value === TYPOGRAPHY.emptyString ||
    value.replace(/\s+/, TYPOGRAPHY.emptyString) === TYPOGRAPHY.emptyString
    ? true
    : false;
};

export const validValue = (value) => {
  return valueDefined(value) ? true : false;
};

export const valueInLimits = (value, limits) => {
  return limits.min <= value && value <= limits.max;
};

export const valueDefined = (value) => {
  return (value !== undefined && value !== null) ? true : false;
};
