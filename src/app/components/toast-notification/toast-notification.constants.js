"use strict";

export const DOM_ELEMENT_ID = {
  container: "toast-notification",
};

export const DOM_ELEMENT_CLASS = {
  show: "toast-notification--show",
  toastNotification: "toast-notification",
  title: "toast-notification-title",
  titleIcon: "toast-notification-title-icon",
  toastCloseBtn: "toast-close-btn",
};

export const NOTIFICATION_MESSAGE = {
  connectionError: {
    type: "error",
    title: "Connection Error",
    content: ["Connection to online gaming failed!", "Please try again."],
  },
  connectionErrorRefresh: {
    type: "error",
    title: "Connection Error",
    content: [
      "Connection to online gaming failed!",
      "Please refresh and try again.",
    ],
  },
  usernameInUse: {
    type: "error",
    title: "Oups!",
    content: [
      "Username is not available!",
      "Please join with a different username."
    ],
  },
  usernameInUseReconnect: {
    type: "error",
    title: "Oups!",
    content: [
      "Username is not available!",
      "Please join with a different username.",
      "<i>(To change your username you have to logout first!).</i>"
    ],
  },
  opponentPlayerSameName: {
    type: "error",
    title: "Oups!",
    content: [
      "Opponent's name is same as yours!",
      "Please add a different name for the opponent.",
    ],
  },
};
