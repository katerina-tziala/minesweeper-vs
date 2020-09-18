'use strict';
import { StyleClassList } from './ui.constants.js';
import { Typography } from '../constants/typography.constants.js';

export class ElementHandler {

    static setElementId(element, id) {
        element.setAttribute('id', id);
    }

    static getElementByID(elementId) {
        return new Promise((resolve, reject) => {
            const element = document.getElementById(elementId);
            element ? resolve(element) : reject(`element with id ${elementId} does not exist`);
        });
    }

    static hideElement(element) {
        ElementHandler.addElementStyleClass(element, StyleClassList.hidden);
    }

    static displayElement(element) {
        ElementHandler.removeElementStyleClass(element, StyleClassList.hidden);
    }

    static removeElementStyleClass(element, className) {
        element.classList.remove(className);
    }

    static addElementStyleClass(element, className) {
        element.classList.add(className);
    }

    static clearElementContent(element) {
        ElementHandler.setElementContent(element, Typography.emptyString);
    }

    static setElementContent(element, content) {
        element.innerHTML = content;
    }

    static setElementClassName(element, className) {
        element.className = className;
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

    static setElementAriaLabel(element, ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
    }

    static setElementAriaAssertive(element) {
        element.setAttribute('aria-live', 'assertive');
    }

    static setElementAlertRole(element) {
        ElementHandler.setElementRole(element, 'alert');
    }

    static setElementRole(element, role) {
        element.setAttribute('role', role);
    }

    static removeElementAriaLive(element) {
        element.removeAttribute('aria-live');
    }

    static removeElementRole(element) {
        element.removeAttribute('role');
    }

    static setDisabled(element, isDisabled) {
        element.disabled = isDisabled;
    }

}