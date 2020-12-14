"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";

export const emptyString = (value) => {
  return value === TYPOGRAPHY.emptyString ||
    value.replace(/\s+/, TYPOGRAPHY.emptyString) === TYPOGRAPHY.emptyString
    ? true
    : false;
};

export const validValue = (value) => {
  return !isNaN(value) && value !== null ? true : false;
};

export const valueInLimits = (value, limits) => {
  return limits.min <= value && value <= limits.max;
};
