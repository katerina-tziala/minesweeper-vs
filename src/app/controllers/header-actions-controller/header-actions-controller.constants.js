"use strict";

export const DOM_ELEMENT_ID = {
  container: "header-actions-container",
};

export const DOM_ELEMENT_CLASS = {
};

export const BUTTONS = {
  loggout: {
    className: "btn-icon header-btn header-btn--logout",
    attributes: {
      "aria-label": "logout",
      id: "header-btn__logout"
    },
    actionType: "click",
  },
  home: {
    className: "btn-icon header-btn header-btn--home",
    attributes: {
      "aria-label": "go to home",
      id: "header-btn__home"
    },
    actionType: "click",
  }
};