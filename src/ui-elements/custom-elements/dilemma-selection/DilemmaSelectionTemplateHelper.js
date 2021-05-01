import './dilemma-selection.scss';
import { TEMPLATE, TEMPLATE_REF_VALUE_ANGOR } from './dilemma-selection.constants';
import { replaceStringParameter } from '../../../app/utils/utils';

export class DilemmaSelectionTemplateHelper {

  static getTemplateValueReference(contentParameter) {
    return `${TEMPLATE_REF_VALUE_ANGOR}${contentParameter}${TEMPLATE_REF_VALUE_ANGOR}`;
  }

  static generateTemplate(content) {
    let template = TEMPLATE;
    for (const [key, value] of Object.entries(content)) {
      const templateReference = DilemmaSelectionTemplateHelper.getTemplateValueReference(key);
      template = replaceStringParameter(template, value, templateReference);
    }
    return template;
  }

}
