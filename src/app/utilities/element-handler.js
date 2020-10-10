'use strict';

import { TYPOGRAPHY } from './constants/typography.constants.js';
import { DOM_ELEMENT_CLASS } from './constants/ui.constants';

export class ElementHandler {

    static getByID(elementId) {
        return new Promise((resolve, reject) => {
            const element = document.getElementById(elementId);
            element ? resolve(element) : reject(`element with id ${elementId} does not exist`);
        });
    }

    static clearContent(element) {
        ElementHandler.setContent(element, TYPOGRAPHY.emptyString);
    }

    static setContent(element, content) {
        element.innerHTML = content;
    }

    static hide(element) {
        ElementHandler.addStyleClass(element, DOM_ELEMENT_CLASS.hidden);
    }

    static display(element) {
        ElementHandler.removeStyleClass(element, DOM_ELEMENT_CLASS.hidden);
    }

    static addStyleClass(element, className) {
        element.classList.add(className);
    }

    static removeStyleClass(element, className) {
        element.classList.remove(className);
    }

    static setAttributes(element, attributes) {
        Object.keys(attributes).forEach(key => element[key] = attributes[key]);
    }

    static setID(element, id) {
        element.setAttribute('id', id);
    }

    static setAlertRole(element) {
        ElementHandler.setRole(element, 'alert');
    }

    static setAriaAssertive(element) {
        element.setAttribute('aria-live', 'assertive');
    }

    static setRole(element, role) {
        element.setAttribute('role', role);
    }

    static removeAriaLive(element) {
        element.removeAttribute('aria-live');
    }

    static removeRole(element) {
        element.removeAttribute('role');
    }

    static setAriaLabel(element, ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
    }

    static setDisabled(element, isDisabled) {
        element.disabled = isDisabled;
    }

    static getID(element) {
        return element.getAttribute("id");
    }

    static setColor(element, color) {
        if (color && color.length) {
            element.style.color = color;
        }
    }

    static setBackgroundColor(element, color) {
        if (color && color.length) {
            element.style.backgroundColor = color;
        }
    }
}