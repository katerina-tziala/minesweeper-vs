"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./icon-loader.constants";

export class IconLoader {

  static generateIcon(colorType) {
    const styles = [DOM_ELEMENT_CLASS.loader];
    if (colorType) {
      styles.push(DOM_ELEMENT_CLASS.loaderColor + colorType);
    }
    return ElementGenerator.generateContainer(styles);
  }

  static generate(colorType) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container]);
    container.append(IconLoader.generateIcon(colorType));
    return container;
  }

  static getLoaderContainer(parentContainer) {
    return parentContainer.querySelector(`.${DOM_ELEMENT_CLASS.container}`);
  }

  static remove(parentContainer) {
    const loaderContainer = IconLoader.getLoaderContainer(parentContainer);
    if (loaderContainer) {
      loaderContainer.remove();
    }
  }

}
