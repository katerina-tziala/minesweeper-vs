"use strict";

export const DOM_ELEMENT_CLASS = {
  item: "invitation-list-item",
  contentContainer: "invitation__content-container",
  details: "invitation__details",
  actions: "invitation__actions"
};

export const ACTION_BUTTONS = {
  accept: {
    className: "invitation__btn invitation__btn--play",
    attributes: {
      "aria-label": "play",
    },
    actionType: "click",
  },
  reject: {
    className: "invitation__btn invitation__btn--reject",
    attributes: {
      "aria-label": "delete",
    },
    actionType: "click",
  }
};

export const HEIGHT_CONFIG = {
  initial: 82,
  addition: 10
};
