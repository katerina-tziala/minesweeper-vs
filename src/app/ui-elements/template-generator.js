

import { replaceStringParameter } from 'UTILS';
const TEMPLATE_REF_VALUE_ANGOR = '%';

export class TemplateGenerator {

  static setTemplate(element, template, content) {
    if (element) {
      const templateNode = TemplateGenerator.generate(template, content);
      element.innerHTML = '';
      element.append(templateNode);
    }
  }

  static generate(template, content) {
    const templateNode = document.createElement('template');
    templateNode.innerHTML = TemplateGenerator.#updateTemplateString(template, content);
    return templateNode.content.cloneNode(true);
  }

  static #updateTemplateString(template, content) {
    if (!content) {
      return template;
    }

    for (const [key, value] of Object.entries(content)) {
      const templateReference = TemplateGenerator.#getTemplateValueReference(key);
      template = TemplateGenerator.#replaceTemplateValueReference(template, templateReference, value);
    }
    return template;
  }

  static #getTemplateValueReference(contentParameter) {
    return `${TEMPLATE_REF_VALUE_ANGOR}${contentParameter}${TEMPLATE_REF_VALUE_ANGOR}`;
  }

  static #replaceTemplateValueReference(template, templateReference, value) {
    const templateParts = template.split(templateReference);
    return templateParts.join(value);
  }
}
