import './dilemma-selection.scss';
import { TEMPLATE, CONTENT, DOM_ELEMENT_CLASS } from './dilemma-selection.constants';
import { ElementHandler } from '../../element-handler';
import { TemplateGenerator } from '../../template-generator';

export class DilemmaSelectionTemplateHelper {

  static generateTemplate(content = CONTENT.default) {
    return TemplateGenerator.generate(TEMPLATE, content);
  }

  static shakeContent(container) {
    ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.shake);
  }

  static stopContentShaking(container) {
    ElementHandler.removeStyleClass(container, DOM_ELEMENT_CLASS.shake);
  }
}
