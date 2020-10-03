'use strict';
import { StyleClassList } from '../ui-utils/ui.constants.js';
import { Typography } from './constants/typography.constants.js';

export class ElementHandler {

    static getByID(elementId) {
        return new Promise((resolve, reject) => {
            const element = document.getElementById(elementId);
            element ? resolve(element) : reject(`element with id ${elementId} does not exist`);
        });
    }

    static clearContent(element) {
        ElementHandler.setContent(element, Typography.emptyString);
    }

    static setContent(element, content) {
        element.innerHTML = content;
    }

    static hide(element) {
        ElementHandler.addStyleClass(element, StyleClassList.hidden);
    }

    static display(element) {
        ElementHandler.removeStyleClass(element, StyleClassList.hidden);
    }

    static addStyleClass(element, className) {
        element.classList.add(className);
    }

    static removeStyleClass(element, className) {
        element.classList.remove(className);
    }

    static setID(element, id) {
        element.setAttribute('id', id);
    }

    static setAriaLabel(element, ariaLabel) {
        element.setAttribute('aria-label', ariaLabel);
    }




    // static setElementClassName(element, className) {
    //     element.className = className;
    // }

    // static setColor(element, color) {
    //     if (color && color.length) {
    //         element.style.color = color;
    //     }
    // }

    // static setBackgroundColor(element, color) {
    //     if (color && color.length) {
    //         element.style.backgroundColor = color;
    //     }
    // }


    // static setElementAriaAssertive(element) {
    //     element.setAttribute('aria-live', 'assertive');
    // }

    // static setElementAlertRole(element) {
    //     ElementHandler.setElementRole(element, 'alert');
    // }

    // static setElementRole(element, role) {
    //     element.setAttribute('role', role);
    // }

    // static removeElementAriaLive(element) {
    //     element.removeAttribute('aria-live');
    // }

    // static removeElementRole(element) {
    //     element.removeAttribute('role');
    // }

    // static setDisabled(element, isDisabled) {
    //     element.disabled = isDisabled;
    // }

}