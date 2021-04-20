"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, BUTTONS } from "./navigation-controller.constants";

export class NavigationController {
 
  static setNavigation(options = []) {
    return NavigationController.#clearedContainer.then(container => {
      container.append(NavigationController.#renderButtons(options));
      return;
    });
  }

  static #renderButtons(options = []) {
    const fragment = document.createDocumentFragment();
    options.forEach(option => {
      const button = NavigationController.#generateButton(option);
      fragment.append(button);
    });
    return fragment;
  }

  static #generateButton(option) {
    if (!option || !option.page || !option.action) {
      return;
    }
    return ElementGenerator.generateButton(BUTTONS[option.page], option.action);
  }

  static get #clearedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.navigation).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }
  
}
