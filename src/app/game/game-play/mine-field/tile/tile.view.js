"use strict";

import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { clone } from "~/_utils/utils.js";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, TILE_BTN } from "./tile.constants";

import { GameAction } from "Game";
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


  // getTileCellContent() {
  //   return new Promise((resolve) => {
  //     const cell = document.getElementById(this.getCellID());
  //     if (cell && cell.children[0]) {
  //       resolve(cell.children[0]);
  //     }
  //   });
  // }

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

  setRevealedView(isMineRevealed, userAction = true) {
    this.tileButton.then(button => button.remove());
    if (isMineRevealed && userAction) {
      this.tileCell.then(tileCell => ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.mineReveled));
    }
  }

  // setFlag(flagColor) {
  //   this.getTileButton().then(button => {
  //     ElementHandler.setColor(button, flagColor);
  //     this.updateTileButtonStyle(button, this.#styleClassList.flaggedTile);
  //   });
  // }

  // setWrongFlagHint() {
  //   this.getTileButton().then(button => this.updateTileButtonStyle(button, this.#styleClassList.wronglyFlaggedTile));
  // }

  // updateTileButtonStyle(button, styleClassName = this.#styleClassList.tileBtn) {
  //   ElementHandler.setElementClassName(button, styleClassName);
  // }

  // resetTileButtonStyling() {
  //   this.getTileButton().then(button => {
  //     this.updateTileButtonStyle(button);
  //     ElementHandler.clearInlineStyling(button);
  //   });
  // }

  // setMark(playerColor) {
  //   this.getTileButton().then(button => {
  //     this.updateTileButtonStyle(button, this.#styleClassList.markedTile);
  //     ElementHandler.setColor(button, playerColor);
  //   });
  // }

  // toggleButtonInteraction(disabled) {
  //   this.getTileButton().then(button => {
  //     this.setDisabled(disabled);
  //     ElementHandler.setDisabled(button, this.isDisabled());
  //   });
  // }

}
