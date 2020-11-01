"use strict";

export const CLOSE_BTN = {
	className: "_btn-icon button-icon--close",
	attributes: {
		"aria-label": "close"
	},
	actionType: "click"
};

export const SETTINGS_BTN = {
	className: "_btn-icon header-btn header-btn--settings",
	attributes: {
		"aria-label": "display settings",
		"aria-expanded": false,
		"id": "settings-toggle-btn"
	},
	actionType: "click"
};