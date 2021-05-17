'use strict';
import { ElementHandler } from '../element-handler';
import { AriaHandler } from '../aria-handler';
import { ICON_BUTTON } from './buttons.constants';

export class ButtonGenerator {


  static #addClickListener(button, action) {
    if (button && action) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        action();
      });
    }
  }

  static generateTextButton(buttonText, action) {
    const button = this.generateButton(action);
    ElementHandler.addStyleClass(button, 'button-text');
    ElementHandler.addStyleClass(button, 'button--primary');
    ElementHandler.setContent(button, buttonText);
    return button;
  }

  static generateButton(action) {
    const button = document.createElement('button');
    ButtonGenerator.#addClickListener(button, action);
    return button;
  }

  static generateIconButton(type, action) {
    const button = this.generateButton(action);
    const params = ICON_BUTTON[type];
    if (params) {
      ElementHandler.addStyleClass(button, params.className);
      AriaHandler.setAriaLabel(button, params.ariaLabel);
    }
    return button;
  }

  static generateIconButtonClose(action) {
    const button = this.generateButton(action);
    const params = ICON_BUTTON.close;
    ElementHandler.addStyleClass(button, params.className);
    AriaHandler.setAriaLabel(button, params.ariaLabel);
    return button;
  }



}
