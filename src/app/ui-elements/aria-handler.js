'use strict';

export class AriaHandler {

  static setRole(element, role) {
    if (element) {
      element.setAttribute('role', role);
    }
  }

  static setAriaAssertive(element) {
    if (element) {
      element.setAttribute('aria-live', 'assertive');
    }
  }

  static removeAriaLive(element) {
    if (element) {
      element.removeAttribute('aria-live');
    }
  }

  static setAlertRole(element) {
    if (element) {
      AriaHandler.setRole(element, 'alert');
      AriaHandler.setAriaAssertive(element);
    }
  }

  static removeRole(element) {
    if (element) {
      element.removeAttribute('role');
      AriaHandler.removeAriaLive(element);
    }
  }

  static setAriaLabel(element, ariaLabel = '') {
    if (element) {
      element.setAttribute('aria-label', ariaLabel);
    }
  }

  static setTabindex(element, value = 0) {
    if (element) {
      element.setAttribute('tabindex', value);
    }
  }

  static setAriaDisabled(element, value = false) {
    if (element) {
      element.setAttribute('aria-disabled', value);
    }
  }

  static setAriaChecked(element, value = false) {
    if (element) {
      element.setAttribute('aria-checked', value);
    }
  }

  static setAriaExpanded(element, value = false) {
    if (element) {
      element.setAttribute('aria-expanded', value);
    }
  }

  static setAriaControls(element, id = '') {
    if (element && id.length) {
      element.setAttribute('aria-controls', id);
    }
  }


  static getAriaControls(element) {
    return element ? element.getAttribute('aria-controls') : undefined;
  }

  static setAriaHidden(element, value = false) {
    if (element) {
      element.setAttribute('aria-hidden', value);
    }
  }

  // static setListTabindex(elements, value) {
  //   elements.forEach((element) => AriaHandler.setTabindex(element, value));
  // }

  // static getAriaChecked(element) {
  //   return JSON.parse(element.getAttribute('aria-checked'));
  // }

  static getActiveDescendant(element) {
    return element.getAttribute('aria-activedescendant');
  }

  static setActiveDescendant(element, value = '') {
    if (element) {
      return element.setAttribute('aria-activedescendant', value);
    }
    
  }



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
