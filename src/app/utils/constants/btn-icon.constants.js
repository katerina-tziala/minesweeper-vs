"use strict";

export const CLOSE_BTN = {
	className: "btn-icon btn-icon--close",
	attributes: {
		"aria-label": "close"
	},
	actionType: "click"
};

export const SETTINGS_BTN = {
	className: "btn-icon header-btn header-btn--settings",
	attributes: {
		"aria-label": "display settings",
		"aria-expanded": false,
		"id": "settings-toggle-btn"
	},
	actionType: "click"
};