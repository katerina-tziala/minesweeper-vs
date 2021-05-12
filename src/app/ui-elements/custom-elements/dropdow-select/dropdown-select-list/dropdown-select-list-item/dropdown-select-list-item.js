
import { DOM_ELEMENT_CLASS, TEMPLATE } from './dropdown-select-list-item.constants';

import { ElementHandler, AriaHandler, TemplateGenerator } from 'UI_ELEMENTS';


export class DropdownSelectListItem {


  static generate(option, action) {
    const template = TemplateGenerator.generate(TEMPLATE, option);
    const listItem = template.children[0];
    listItem.addEventListener('click', () => {
      action(option);
    });
    // listItem.addEventListener('mouseenter', () => listItem.focus());
    return listItem;
  }

  
  
}
