"use strict";

export const DOM_ELEMENT_ID = {
  item: "invitation-list-item__"
};

export const DOM_ELEMENT_CLASS = {
  item: "invitation-list-item",
  contentContainer: "invitation__content-container",
  details: "invitation__details",
  actions: "invitation__actions"
};

export const ACTION_BUTTONS = {
  play: {
    className: "invitation__btn invitation__btn--play",
    attributes: {
      "aria-label": "play",
    },
    actionType: "click",
  },
  // details: {
  //   className: "invitation__btn invitation__btn--details",
  //   attributes: {
  //     "aria-label": "see details",
  //   },
  //   actionType: "click",
  // },
  reject: {
    className: "invitation__btn invitation__btn--reject",
    attributes: {
      "aria-label": "delete",
    },
    actionType: "click",
  }
};


