import { TYPOGRAPHY } from "~/_constants/typography.constants";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_CLASS,
  BUTTON,
  ARIA,
} from "./sneak-peek-button.constants";

export class SneakPeekButton {
  #action;

  constructor(action, parralel = false) {
    this.isParralel = parralel;
    this.disabled = true;
    this.peeking = false;
    this.#action = action;
  }

  get #button() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.button);
  }

  #setButtonState(button, colorType, limit) {
    ElementHandler.clearContent(button);
    ElementHandler.setStyleClass(button, this.#getButtonStyles(colorType));
    ElementHandler.setDisabled(button, this.disabled);
    button.append(this.#getButtonContent(limit));
    this.#setButtonARIA(button);
  }

  #setButtonARIA(button) {
    AriaHandler.setAriaLabel(button, this.#buttonAria);
    AriaHandler.setAriaChecked(button, this.peeking);
  }

  get #buttonAria() {
    const stateKey = JSON.stringify(this.peeking);
    if (this.isParralel) {
      return ARIA.parallel[stateKey];
    }
    return ARIA.default[stateKey];
  }

  #getButtonContent(limit) {
    const styles = [DOM_ELEMENT_CLASS.buttonState];
    const container = document.createElement("span");
    if (this.peeking) {
      styles.push(DOM_ELEMENT_CLASS.peeking);
    } else {
      styles.push(DOM_ELEMENT_CLASS.notPeeking);
      container.append(this.#generateLimitIndicator(limit));
    }
    ElementHandler.setStyleClass(container, styles);
    return container;
  }

  #getButtonStyles(colorType) {
    const styles = [DOM_ELEMENT_CLASS.button];

    if (this.peeking && colorType) {
      const colorTypeStyle = this.#getColorTypeStyle(colorType);
      styles.push(colorTypeStyle);
    }

    return styles;
  }

  #getColorTypeStyle(colorType) {
    return DOM_ELEMENT_CLASS.button + TYPOGRAPHY.doubleHyphen + colorType;
  }

  #generateLimitIndicator(limit) {
    const styles = this.#getLimitStyles(limit);
    const container = document.createElement("span");
    ElementHandler.setStyleClass(container, styles);

    if (limit !== undefined) {
      container.innerHTML = limit;
    }
    return container;
  }

  #getLimitStyles(limit) {
    const styles = [DOM_ELEMENT_CLASS.limit];

    if (limit >= 0 && limit < 2) {
      styles.push(DOM_ELEMENT_CLASS.limit + TYPOGRAPHY.doubleHyphen + limit);
    }

    return styles;
  }

  #onClick() {
    if (this.#action) {
      this.#action(!this.peeking);
    }
  }

  generate() {
    const button = ElementGenerator.generateButton(
      BUTTON,
      this.#onClick.bind(this),
    );
    ElementHandler.setID(button, DOM_ELEMENT_CLASS.button);
    this.#setButtonState(button);
    return button;
  }

  setState(disabled, colorType, limit) {
    this.disabled = disabled;
    if (this.disabled) {
      this.peeking = false;
    }
    this.#button.then(button => this.#setButtonState(button, colorType, limit));
  }

  playerPeeking(colorType) {
    this.peeking = true;
    this.#button.then(button => this.#setButtonState(button, colorType));
  }

}
