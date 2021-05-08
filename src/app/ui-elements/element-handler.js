'use strict';
import { TYPOGRAPHY, valueDefined } from 'UTILS';

export class ElementHandler {

  static clearContent(element) {
    this.setContent(element, '');
  }

  static setContent(element, content = '') {
    if (element) {
      element.innerHTML = content;
    }
  }

  static hide(element) {
    this.addStyleClass(element, 'hidden');
  }

  static display(element) {
    this.removeStyleClass(element, 'hidden');
  }

  static addStyleClass(element, className) {
    if (element && className) {
      element.classList.add(className);
    }
  }

  static removeStyleClass(element, className) {
    if (element && className) {
      element.classList.remove(className);
    }
  }

  static swapStyleClass(element, styleToRemove, styleToAdd) {
    ElementHandler.removeStyleClass(element, styleToRemove);
    ElementHandler.addStyleClass(element, styleToAdd);
  }

  static addStylesAndId(element, styles = [], elementId) {
    if (!element) {
      return;
    }
    ElementHandler.setStyleClass(element, styles);
    ElementHandler.setElementId(element, elementId);
  }

  static setStyleClass(element, styleClasses = []) {
    if (element && styleClasses.length) {
      element.className = styleClasses.join(TYPOGRAPHY.space);
    }
  }

  static setElementId(element, id) {
    if (element && id && id.length) {
      element.setAttribute('id', id);
    }
  }

  static setDisabled(element, disabled = true) {
    if (element) {
      element.disabled = disabled;
    }
  }

  static setName(element, name) {
    if (element && name && name.length) {
      element.setAttribute('name', name);
    }
  }

  static setElementValue(element, value) {
    if (element && valueDefined(value)) {
      element.value = value;
    }
  }

  static updateElementStyles(element, styles) {
    const stylesAttributes = Object.keys(styles) || [];
    if (element) {
      stylesAttributes.forEach(styleProperty => {
        element.style[styleProperty] = styles[styleProperty];
      });
    }
  }

  static getElementHeight(element) {
    if (element) {
      return element.getBoundingClientRect().height;
    }
    return 0;
  }

  static setForAttribute(label, name = 'name') {
    if (label) {
      label.setAttribute('for', name);
    }
  }
}
