import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { AriaHandler } from '../../aria-handler';
import { DOM_ELEMENT_CLASS } from './text-input.constants';

export class TextInputTemplateHelper {

  static clearErrorMessage(inputError) {
    inputError.innerHTML = '';
    AriaHandler.removeRole(inputError);
    ElementHandler.hide(inputError);
  }

  static setErrorMessage(inputError, message = '') {
    inputError.innerHTML = message;
    AriaHandler.setAlertRole(inputError);
    ElementHandler.display(inputError);
  }

  static shakeLabel(label) {
    ElementHandler.addStyleClass(label, DOM_ELEMENT_CLASS.labelShake);
  }

  static clearLabelShake(label) {
    ElementHandler.removeStyleClass(label, DOM_ELEMENT_CLASS.labelShake);
  }

  static setFieldName(inputField, name = 'name') {
    inputField.name = name;
    ElementHandler.setElementId(inputField, name);
  }

  static setLabelForAttribute(label, name = 'name') {
    label.setAttribute('for', name);
  }

  static setLabelText(label, text = 'name') {
    label.innerHTML = text;
  }
}
