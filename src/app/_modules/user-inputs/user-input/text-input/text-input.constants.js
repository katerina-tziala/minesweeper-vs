"use strict";

export const DOM_ELEMENT_CLASS = {
  inputContainer: "text-input-container",
  inputField: "text-input",
};

export const FIELD_PARAMS = {
  type: "text",
  name: undefined,
  actionType: "keyup",
  placeholder: "enter ###",
  attributes: {
    "aria-label": "enter ###",
  },
};

export const FIELD_ERRORS = {
  empty: "### cannot be empty!",
  minLength: "### must be at least ### characters long!",
  maxLength: "### cannot be longer than ### characters!"
};

export const VALUE_LENGTH = {
  min: 3,
  max: null
};
