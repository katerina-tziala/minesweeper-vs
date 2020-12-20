"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./sneak-peek-counter.constants";

export class SneakPeekCounter {
  static get generate() {
    const counterContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.counter,
    ]);
    counterContainer.append(SneakPeekCounter.generateValueContainer);
    return counterContainer;
  }

  static get generateValueContainer() {
    const container = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.value],
      DOM_ELEMENT_CLASS.value,
    );
    return container;
  }

  static get animatedValueContainer() {
    const container = SneakPeekCounter.generateValueContainer;
    ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.valueAnimated);
    return container;
  }

  static getColorTypeClass(colorType) {
    return DOM_ELEMENT_CLASS.value+"--"+colorType;
  }

  static get valueContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.value);
  }

  static updateValue(value, colorType) {
    SneakPeekCounter.valueContainer.then((container) => {
      const animatedContainer = SneakPeekCounter.animatedValueContainer;
      animatedContainer.innerHTML = value;
      ElementHandler.addStyleClass(animatedContainer, SneakPeekCounter.getColorTypeClass(colorType));

      container.before(animatedContainer);
      container.remove();
    });
  }
}
