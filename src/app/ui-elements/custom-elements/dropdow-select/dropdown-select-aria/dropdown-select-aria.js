
import { ARIA_LABEL } from './dropdown-select.constants';
import { AriaHandler } from 'UI_ELEMENTS';

export class DropdownSelectAria {

  static defaultLabel(name) {
    return name ? `${ARIA_LABEL.default} ${name}` : '';
  }

  static getLabel(name = '') {
    return ARIA_LABEL[name] || DropdownSelectAria.defaultLabel(name);
  }

  static setDefaultLabel(element, name) {
    const ariaLabel = DropdownSelectAria.getLabel(name);
    AriaHandler.setAriaLabel(element, ariaLabel);
  }


}

