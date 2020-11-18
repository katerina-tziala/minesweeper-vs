"use strict";

export const DOM_ELEMENT_ID = {
  dropdownContainer: "dropdown-container__",
  listbox: "dropdown-listbox__",
};

export const DOM_ELEMENT_CLASS = {
  container: "dropdown-container",
  listboxOption: "dropdown-listbox-option",
  listboxContainer: "dropdown-listbox-container",
  listbox: "dropdown-listbox",
  listboxScrollable: "dropdown-listbox--scrollable"
};

export const CONTENT = {
  defaultSelectText: "select an option",
  selectText: "select ###",
};

export const OPTION_ATTRIBUTES = {
  "role": "option",
  "value": "",
  "id": "###-option__",
  "aria-setsize": "",
  "aria-posinset": "",
};

export const LISTBOX_ATTRIBUTES = {
  "role": "listbox",
  "aria-multiselectable": false,
  "aria-required": true,
  "aria-label": "",
  "aria-activedescendant": "",
  "id": "",
};
