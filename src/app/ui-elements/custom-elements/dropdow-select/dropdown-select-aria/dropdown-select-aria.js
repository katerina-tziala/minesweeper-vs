
import { ARIA_LABEL } from './dropdown-select.constants';

export class DropdownSelectAria {

  static defaultLabel(name) {
    return name ? `${ARIA_LABEL.default} ${name}` : '';
  }

  static getLabel(name = '') {
    return ARIA_LABEL[name] || DropdownSelectAria.defaultLabel(name);
  }



}

