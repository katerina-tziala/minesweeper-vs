'use strict';

export class AriaHandler {
  static setRole(element, role) {
    element.setAttribute('role', role);
  }

  static setAlertRole(element) {
    AriaHandler.setRole(element, 'alert');
    console.log("hhhhhh");
    AriaHandler.setAriaAssertive(element);
  }

  static setAriaAssertive(element) {
    console.log('setAriaAssertive');
    element.setAttribute('aria-live', 'assertive');
  }


  static removeRole(element) {
    element.removeAttribute('role');
    AriaHandler.removeAriaLive(element);
  }

  static removeAriaLive(element) {
    element.removeAttribute('aria-live');
  }



  // static setAriaLabel(element, ariaLabel) {
  //   element.setAttribute('aria-label', ariaLabel);
  // }

  // static setTabindex(element, value) {
  //   element.setAttribute('tabindex', value);
  // }

  // static setListTabindex(elements, value) {
  //   elements.forEach((element) => AriaHandler.setTabindex(element, value));
  // }

  // static setAriaChecked(element, value) {
  //   element.setAttribute('aria-checked', value);
  // }

  // static getAriaChecked(element) {
  //   return JSON.parse(element.getAttribute('aria-checked'));
  // }

  // static getActiveDescendant(element) {
  //   return element.getAttribute('aria-activedescendant');
  // }

  // static setActiveDescendant(element, value) {
  //   return element.setAttribute('aria-activedescendant', value);
  // }

  // static setAriaExpanded(element, value) {
  //   element.setAttribute('aria-expanded', value);
  // }

  // static getAriaExpanded(element) {
  //   return JSON.parse(element.getAttribute('aria-expanded'));
  // }

  // static setAriaSelected(element) {
  //   element.setAttribute('aria-selected', true);
  // }

  // static removeAriaSelected(element) {
  //   element.removeAttribute('aria-selected');
  // }

  // static setLabeledBy(element, labelId) {
  //   element.setAttribute('aria-labelledby', labelId);
  // }

  // static removeLabeledBy(element) {
  //   element.removeAttribute('aria-labelledby');
  // }

  // static setAriaModal(element, labelId) {
  //   element.setAttribute('aria-modal', true);
  //   AriaHandler.setRole(element, 'dialog');
  //   AriaHandler.setLabeledBy(element, labelId);
  // }

  // static removeAriaModal(element) {
  //   element.removeAttribute('aria-modal');
  //   AriaHandler.removeRole(element);
  //   AriaHandler.removeLabeledBy(element);
  // }
}
