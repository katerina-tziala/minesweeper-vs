"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants.js";
import { DOM_ELEMENT_CLASS } from "~/_constants/ui.constants";
import { clone } from "~/_utils/utils.js";

export class ElementHandler {
  static getByID(elementId) {
    return new Promise((resolve, reject) => {
      const element = document.getElementById(elementId);
      element
        ? resolve(element)
        : reject(`element with id ${elementId} does not exist`);
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

  static addStyles(element, styleClasses) {
    styleClasses.forEach(style => {
      ElementHandler.addStyleClass(element, style);
    });
  }

  static setStyleClass(element, styleClasses) {
    let className = TYPOGRAPHY.emptyString;
    if (styleClasses.length) {
      className = styleClasses.join(TYPOGRAPHY.space);
    }
    element.className = className;
  }

  static removeStyleClass(element, className) {
    element.classList.remove(className);
  }

  static setParams(element, params) {
    if (!params) {
      return;
    }
    params = clone(params);
    const attributes = params.attributes;
    delete params.attributes;
    Object.keys(params).forEach((key) => (element[key] = params[key]));
    if (attributes) {
      this.setAttributes(element, attributes);
    }
  }

  static setAttributes(element, attributes) {
    Object.keys(attributes).forEach((key) =>
      element.setAttribute(key, attributes[key]),
    );
  }

  static setID(element, id) {
    element.setAttribute("id", id);
  }

  static setDisabled(element, isDisabled) {
    element.disabled = isDisabled;
  }

  static setReadOnly(element, readOnly) {
    element.readOnly = readOnly;
  }

  static getID(element) {
    return element.getAttribute("id");
  }

  static addInChildNodes(parent, element, position = 1) {
    parent.insertBefore(element, parent.childNodes[position]);
  }

  static addStylesAndId(element, styleClasses = [], elementId) {
    if (!element) {
      return;
    }
    if (styleClasses && styleClasses.length) {
      ElementHandler.setStyleClass(element, styleClasses);
    }
    if (elementId) {
      ElementHandler.setID(element, elementId);
    }
  }

  static setElementHeight(element, height = 0) {
    if (element) {
      element.style.height = `${height}px`;
    }
  }

  static setElementOverflow(element, overflow) {
    if (element) {
      element.style.overflow = overflow ? "visible" : "hidden";
    }
  }
}
