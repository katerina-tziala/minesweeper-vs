'use strict"';

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

}
