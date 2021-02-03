"use strict";

export const DOM_ELEMENT_ID = {
  navigation: "header-actions-container",
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
  },
  settings: {
    className: "btn-icon header-btn header-btn--settings",
    attributes: {
      "aria-label": "display settings",
      "aria-expanded": false,
      id: "header-btn__settings",
    },
    actionType: "click",
  },
  connect: {
    className: "btn-icon header-btn header-btn--connect",
    attributes: {
      "aria-label": "connect online",
    },
    actionType: "click",
  },
  invitations: {
    className: "btn-icon header-btn header-btn--invitations",
    attributes: {
      "aria-label": "connect online",
      "aria-expanded": false,
      id: "header-btn__invitations"
    },
    actionType: "click",
  }
};