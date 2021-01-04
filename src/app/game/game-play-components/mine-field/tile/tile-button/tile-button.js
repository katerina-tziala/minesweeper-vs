"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { clone } from "~/_utils/utils.js";
import { GameAction } from "GameEnums";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTON_PARAMS } from "./tile-button.constants";


export class TileButton {
  #_id;
  #_active;
  #onActiveStateChange;
  #onAction;

  constructor(tileId) {
    this.#id = tileId;
    this.#active = false;
  }

  set #id(tileId) {
    this.#_id = DOM_ELEMENT_ID.button + tileId;
  }

  get #id() {
    return this.#_id;
  }

  set #active(active) {
    this.#_active = active;
  }

  get #active() {
    return this.#_active;
  }

  get #buttonParameters() {
    const buttonParams = clone(BUTTON_PARAMS);
    buttonParams.id = this.#id;
    return buttonParams;
  }

  get #button() {
    return ElementHandler.getByID(this.#id);
  }

  set onActiveStateChange(funct) {
    this.#onActiveStateChange = funct;
  }

  set onAction(funct) {
    this.#onAction = funct;
  }

  generateView() {
    const button = ElementGenerator.generateButton(this.#buttonParameters);
    button.addEventListener("mouseenter", this.#onMouseEnter.bind(this));
    button.addEventListener("mouseleave", this.#onMouseLeave.bind(this));
    button.addEventListener("mousedown", this.#activateOnMouseEvent.bind(this));
    button.addEventListener("mouseup", this.#onMouseUp.bind(this));
    return button;
  }

  #mouseEventAllowed(event) {
    return event.which !== 0;
  }

  #onMouseEnter(event) {
    this.#activateOnMouseEvent(event);
  }

  #onMouseLeave() {
    if (this.#active) {
      this.deActivate();
    }
  }

  #onMouseUp(event) {
    if (this.#mouseEventAllowed(event) && this.#active) {
      this.deActivate();

      switch (event.which) {
        case 1: // left mouse click
        case 2: // middle mouse click
          this.#submitRevealAction();
          break;
        case 3: // right mouse click
          this.#submitMarkAction();
          break;
      }

    }
  }

  #activateOnMouseEvent(event) {
    if (this.#mouseEventAllowed(event) && !this.#active) {
      this.activate();
    }
  }

  activate() {
    this.#active = true;
    this.#setActiveView().then(() => this.#submitActiveStateChange());
  }

  deActivate() {
    this.#active = false;
    this.#setInActiveView().then(() => this.#submitActiveStateChange());
  }

  #submitActiveStateChange() {
    if (this.#onActiveStateChange) {
      this.#onActiveStateChange(this.#active);
    }
  }

  #submitAction(action) {
    if (this.#onAction) {
      this.#onAction(action);
    }
  }

  #submitRevealAction() {
    this.#submitAction(GameAction.Reveal);
  }

  #submitMarkAction() {
    this.#submitAction(GameAction.Mark);
  }

  // BUTTON VIEW
  #setActiveView() {
    return this.#button.then(button => {
      ElementHandler.addStyleClass(button, DOM_ELEMENT_CLASS.active);
      return;
    });
  }

  #setInActiveView() {
    return this.#button.then(button => {
      ElementHandler.removeStyleClass(button, DOM_ELEMENT_CLASS.active);
      return;
    });
  }

  #getButtonStyles(colorType) {
    const buttonStyles = [DOM_ELEMENT_CLASS.button];
    if (colorType) {
      buttonStyles.push(DOM_ELEMENT_CLASS.color + colorType);
    }
    return buttonStyles;
  }

  #setButtonStyles(buttonStyles) {
    return this.#button.then(button => {
      ElementHandler.setStyleClass(button, buttonStyles);
      return;
    });
  }

  #addToButtonStyles(buttonStyles) {
    return this.#button.then(button => {
      ElementHandler.addStyles(button, buttonStyles);
      return;
    });
  }

  setFlag(colorType, wrongFlagHint = false) {
    const buttonStyles = this.#getButtonStyles(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.flagged);
    if (wrongFlagHint) {
      buttonStyles.push(DOM_ELEMENT_CLASS.wronglyFlagged);
    }
    return this.#setButtonStyles(buttonStyles);
  }

  setMark(colorType) {
    const buttonStyles = this.#getButtonStyles(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.marked);
    return this.#setButtonStyles(buttonStyles);
  }

  resetTileButtonStyling() {
    const buttonStyles = this.#getButtonStyles();
    return this.#setButtonStyles(buttonStyles);
  }

  destroyButton() {
    return this.#button.then(button => {
      button.remove();
      return;
    });
  }

  revealButton() {
    return this.#button.then(button => {
      ElementHandler.addStyleClass(button, DOM_ELEMENT_CLASS.revealed)
      return;
    });
  }

  #getRevealedStrategyStyles(colorType) {
    const buttonStyles = [DOM_ELEMENT_CLASS.revealed, DOM_ELEMENT_CLASS.doubleStrategy];
    if (colorType) {
      buttonStyles.push(DOM_ELEMENT_CLASS.doubleStrategyColor + colorType);
    }
    return buttonStyles;
  }

  revealAdditionalMark(colorType) {
    const buttonStyles = this.#getRevealedStrategyStyles(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.doubleStrategyMark);
    return this.#addToButtonStyles(buttonStyles);
  }

  revealAdditionalFlag(colorType) {
    const buttonStyles = this.#getRevealedStrategyStyles(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.doubleStrategyFlag);
    return this.#addToButtonStyles(buttonStyles);
  }

}
