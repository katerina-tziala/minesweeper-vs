

import { replaceStringParameter } from '../app/utils/utils';
const TEMPLATE_REF_VALUE_ANGOR = '%';

export class TemplateGenerator {

  static #getTemplateValueReference(contentParameter) {
    return `${TEMPLATE_REF_VALUE_ANGOR}${contentParameter}${TEMPLATE_REF_VALUE_ANGOR}`;
  }

  static generate(template, content) {
    if (!content) {
      return template;
    }
  
    for (const [key, value] of Object.entries(content)) {
      const templateReference = this.#getTemplateValueReference(key);
      template = replaceStringParameter(template, value, templateReference);
    }
    return template;
  }
  
}
