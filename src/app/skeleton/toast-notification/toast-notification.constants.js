'use strict';

export const DOM_ELEMENT_ID = {
    container: 'toast-notification'
};

export const DOM_ELEMENT_CLASS = {
    show: 'toast-notification--show',
    toastNotification: 'toast-notification',
    title: 'toast-notification-title',
    titleIcon: 'toast-notification-title-icon',
};

export const NOTIFICATION_MESSAGE = {
    connectionError: {
        type: "error",
        title: "Connection Error",
        content: ["Connection to online gaming failed!", "Please refresh and try again."]
    },
    usernameError: {
        type: "error",
        title: "Connection Error",
        content: ["Username is not available!", "Please login with a different username."]
    }
};
