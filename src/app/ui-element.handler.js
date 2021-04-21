'use strict"';

export class UIElementHandler {
 
  static clearContent(element) {
    UIElementHandler.setContent(element, '');
  }

  static setContent(element, content) {
    element.innerHTML = content;
  }

  static hide(element) {
    UIElementHandler.addStyleClass(element, 'hidden');
  }

  static display(element) {
    UIElementHandler.removeStyleClass(element, 'hidden');
  }

  static addStyleClass(element, className) {
    element.classList.add(className);
  }

  static removeStyleClass(element, className) {
    element.classList.remove(className);
  }
  
}
