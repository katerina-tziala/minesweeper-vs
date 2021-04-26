'use strict';

export class ElementHandler {

  static clearContent(element) {
    this.setContent(element, '');
  }

  static setContent(element, content) {
    element.innerHTML = content;
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

  static addStylesAndId(element, styles = [], elementId) {
    if (!element) {
      return;
    }
    ElementHandler.setStyleClass(element, styles);
    ElementHandler.setElementId(element, elementId);
  }

  static setStyleClass(element, styleClasses = []) {
    if (element && styleClasses.length) {
      element.className = styleClasses.join(' ');
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
}
