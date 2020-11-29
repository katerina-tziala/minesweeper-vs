"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { clone } from "~/_utils/utils.js";
import { GameAction } from "Game";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, TILE_BTN } from "./tile.constants";
export class TileView {
  #_id;
  #_active;
  #_disabled;

  constructor(id) {
    this.#id = id;
    this.#active = false;
    this.#disabled = false;
  }

  set #id(id) {
    return this.#_id = id.toString();
  }

  get #id() {
    return this.#_id;
  }

  set #active(active) {
    return this.#_active = active;
  }

  get #active() {
    return this.#_active;
  }

  set #disabled(disabled) {
    return this.#_disabled = disabled;
  }

  get #disabled() {
    return this.#_disabled;
  }

  get #cellId() {
    return DOM_ELEMENT_ID.cell + this.#id;
  }

  get #buttonId() {
    return DOM_ELEMENT_ID.button + this.#id;
  }

  get #tileButtonParameters() {
    const buttonParams = clone(TILE_BTN);
    buttonParams.id = this.#buttonId;
    return buttonParams;
  }

  get tileCell() {
    return ElementHandler.getByID(this.#cellId);
  }

  get tileButton() {
    return ElementHandler.getByID(this.#buttonId);
  }

  #getCellStyle(content) {
    return DOM_ELEMENT_CLASS.cellContent + content;
  }

  #generateTileButton(onActivation, onAction) {
    const tileButton = ElementGenerator.generateButton(this.#tileButtonParameters);
    this.#setMouseOverAction(tileButton, onActivation);
    this.#setMouseLeaveAction(tileButton, onActivation);
    this.#setMouseDownAction(tileButton, onActivation);
    this.#setMouseUpAction(tileButton, onAction);
    return tileButton;
  }

  #setMouseOverAction(tileButton, onActivation) {
    tileButton.addEventListener("mouseover", (event) => {
      if (event.which !== 0 && !this.#active) {
        this.#activate();
        onActivation(this.#active);
      }
    }, false);
  }

  #setMouseLeaveAction(tileButton, onActivation) {
    tileButton.addEventListener("mouseleave", () => {
      if (this.#active) {
        this.#deActivate();
        onActivation(this.#active);
      }
    }, false);
  }

  #setMouseDownAction(tileButton, onActivation) {
    tileButton.addEventListener("mousedown", () => {
      if (!this.#active) {
        this.#activate();
        onActivation(this.#active);
      }
    }, false);
  }

  #setMouseUpAction(tileButton, onAction) {
    tileButton.addEventListener("mouseup", (event) => {
      if (this.#active) {
        this.#deActivate();
        switch (event.which) {
          case 1: // left mouse click
          case 2:// middle mouse click
            onAction(GameAction.Reveal);
            break;
          case 3:// right mouse click
            onAction(GameAction.Mark);
            break;
          default:
            break;
        }
      }
    }, false);
  }

  generateView(content, onActivation, onAction) {
    const tileCell = ElementGenerator.generateTableDataCell();
    ElementHandler.setID(tileCell, this.#cellId);
    ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.cell);
    ElementHandler.addStyleClass(tileCell, this.#getCellStyle(content));
    tileCell.append(this.#generateTileButton(onActivation, onAction));
    return tileCell;
  }

  #activate() {
    this.#active = true;
    this.#setButtonActiveStyle();
  }

  #setButtonActiveStyle() {
    this.tileButton.then(button => {
      this.#active ? ElementHandler.addStyleClass(button, DOM_ELEMENT_CLASS.activeButton) :
        ElementHandler.removeStyleClass(button, DOM_ELEMENT_CLASS.activeButton);
    });
  }

  #deActivate() {
    this.#active = false;
    this.#setButtonActiveStyle();
  }

  setRevealedView(isDetonatedMine, userAction = true) {
    this.tileButton.then(button => button.remove());
    if (isDetonatedMine && userAction) {
      this.tileCell.then(tileCell => ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.mineReveled));
    }
  }

  #colorTypeStyle(colorType) {
    return DOM_ELEMENT_CLASS.buttonColor + colorType;
  }


  #getButtonStylesAfterAction(colorType) {
    const buttonStyles = [DOM_ELEMENT_CLASS.button];
    buttonStyles.push(this.#colorTypeStyle(colorType));
    return buttonStyles;
  }

  setFlag(colorType, wrongFlagHint = false) {
    const buttonStyles = this.#getButtonStylesAfterAction(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.buttonFlagged);
    if (wrongFlagHint) {
      buttonStyles.push(DOM_ELEMENT_CLASS.buttonWronglyFlagged);
    }
    this.buttonStyles = buttonStyles;
  }

  set buttonStyles(buttonStyles) {
    this.tileButton.then(button => ElementHandler.setStyleClass(button, buttonStyles));
  }

  resetTileButtonStyling() {
    this.buttonStyles = [DOM_ELEMENT_CLASS.button];
  }

  setMark(colorType) {
    const buttonStyles = this.#getButtonStylesAfterAction(colorType);
    buttonStyles.push(DOM_ELEMENT_CLASS.buttonMarked);
    this.buttonStyles = buttonStyles;
  }

  // toggleButtonInteraction(disabled) {
  //   this.getTileButton().then(button => {
  //     this.setDisabled(disabled);
  //     ElementHandler.setDisabled(button, this.isDisabled());
  //   });
  // }

}
