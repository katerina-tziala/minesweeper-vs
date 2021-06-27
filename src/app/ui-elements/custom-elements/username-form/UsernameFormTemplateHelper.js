
import { TEMPLATE } from './username-form.constants';
import { TemplateGenerator } from '../../template-generator';
import { TYPOGRAPHY } from 'UTILS';

export class UsernameFormTemplateHelper {

  static generateTemplate(type = 'join') {
    return TemplateGenerator.generate(TEMPLATE, { type });
  }

  static setInputValue(input, value = TYPOGRAPHY.emptyString) {
    if (input) {
      input.setAttribute('value', value);
      input.initFocusedState();
    }
  }

  static setInputError(input, error = TYPOGRAPHY.emptyString) {
    if (input) {
      input.setAttribute('error-message', error);
    }
  }
}
