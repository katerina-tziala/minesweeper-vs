'use strict"';

export class ElementHandler {
 
  static clearContent(element) {
    ElementHandler.setContent(element, '');
  }

  static setContent(element, content) {
    element.innerHTML = content;
  }

  static hide(element) {
    ElementHandler.addStyleClass(element, 'hidden');
  }

  static display(element) {
    ElementHandler.removeStyleClass(element, 'hidden');
  }

  static addStyleClass(element, className) {
    element.classList.add(className);
  }

  static removeStyleClass(element, className) {
    element.classList.remove(className);
  }
  
}
