'use strict';
import { ElementHandler, ButtonGenerator, TemplateGenerator } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, CONTENT_TEMPLATE, CONTENT } from './link-invitation-button.constants';

export class LinkInvitationButton {

  static generate(action) {
    const button = ButtonGenerator.generateButton(action);
    ElementHandler.addStyleClass(button, DOM_ELEMENT_CLASS.button);
    const content = TemplateGenerator.generate(CONTENT_TEMPLATE, CONTENT);
    button.append(content);
    return button;
  }

}
