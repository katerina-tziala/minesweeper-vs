"use strict";

import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";


import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./tile.constants";

export class TileView {
  #_id;
  // #mineDisplayType;
  // #active;
  #disabled;
  // #styleClassList;
  // #elementsIDs;
  constructor(id) {
    // this.#mineDisplayType = mineDisplayType;
    this.#id = id;
    // this.#active = false;
    this.#disabled = false;
    // this.#styleClassList = TileConstants.styleClassList;
    // this.#elementsIDs = TileConstants.elementsIDs;
  }


  set #id(id) {
    return this.#_id = id.toString();
  }

  get #id() {
    return this.#_id;
  }


  generateView(content, onActivation, onAction) {
    const tileCell = ElementGenerator.generateTableDataCell();
    ElementHandler.setID(tileCell, this.cellId);
    ElementHandler.addStyleClass(tileCell, DOM_ELEMENT_CLASS.cell);
    ElementHandler.addStyleClass(tileCell, this.getCellStyle(content));
    // tileCell.append(this.generateTileContent(type, neighbors), this.generateTileButton(onActivation, onAction));
    return tileCell;
  }

  get cellId() {
    return DOM_ELEMENT_ID.cell + this.#id;
  }

  getCellStyle(content) {
    return DOM_ELEMENT_CLASS.cellContent + content;
  }

  // generateTileContent(type, neighbors) {
  //   const tileContent = document.createElement("span");
  //   switch (type) {
  //     case TileTypeEnum.Mine:
  //       ElementHandler.setElementClassName(tileContent, this.getMineStyle());
  //       break;
  //     case TileTypeEnum.Count:
  //       const mineCount = neighbors.length;
  //       tileContent.className = this.getCountStyle(mineCount);
  //       ElementHandler.setElementContent(tileContent, mineCount);
  //       break;
  //   }
  //   ElementHandler.addClassToElement(tileContent, this.#styleClassList.cellContent);
  //   return tileContent;
  // }





  // getButtonID() {
  //   return this.#elementsIDs.buttonID + this.getID().toString();
  // }

  // getMineDisplayType() {
  //   return this.#mineDisplayType;
  // }

  // isActive() {
  //   return this.#active;
  // }

  // isDisabled() {
  //   return this.#disabled;
  // }

  // setActive(active) {
  //   return this.#active = active;
  // }

  // setDisabled(disabled) {
  //   return this.#disabled = disabled;
  // }

  // getMineStyle() {
  //   return `${this.#styleClassList.cellContentMine} ${this.#styleClassList.cellContentMine}${Typography.doubleHyphen}${this.getMineDisplayType()}`;
  // }

  // getCountStyle(mineCount) {
  //   return `${this.#styleClassList.cellContentCount} ${this.#styleClassList.cellContentCount}${Typography.doubleHyphen}${mineCount}`;
  // }




  // generateTileButton(onActivation, onAction) {
  //   const tileButton = ButtonGenerator.generateButton(this.getTileButtonParameters());
  //   this.setBoardTileInteractions(tileButton, onActivation, onAction);
  //   return tileButton;
  // }

  // getTileButtonParameters() {
  //   const buttonParams = AppHelper.clone(TileConstants.tileButton);
  //   buttonParams.id = this.getButtonID();
  //   return buttonParams;
  // }

  // setBoardTileInteractions(tileButton, onActivation, onAction) {
  //   this.setMouseOverAction(tileButton, onActivation);
  //   this.setMouseLeaveAction(tileButton, onActivation);
  //   this.setMouseDownAction(tileButton, onActivation);
  //   this.setMouseUpAction(tileButton, onAction);
  // }

  // setMouseOverAction(tileButton, onActivation) {
  //   tileButton.addEventListener("mouseover", (event) => {
  //     if (event.which !== 0 && !this.isActive()) {
  //       this.activate();
  //       onActivation(true);
  //     }
  //   }, false);
  // }

  // setMouseLeaveAction(tileButton, onActivation) {
  //   tileButton.addEventListener("mouseleave", () => {
  //     if (this.isActive()) {
  //       this.deActivate();
  //       onActivation(false);
  //     }
  //   }, false);
  // }

  // setMouseDownAction(tileButton, onActivation) {
  //   tileButton.addEventListener("mousedown", () => {
  //     if (!this.isActive()) {
  //       this.activate();
  //       onActivation(true);
  //     }
  //   }, false);
  // }

  // setMouseUpAction(tileButton, onAction) {
  //   tileButton.addEventListener("mouseup", (event) => {
  //     if (this.isActive()) {
  //       this.deActivate();
  //       switch (event.which) {
  //         case 1: // left mouse click
  //         case 2:// middle mouse click
  //           onAction(TileActionTypeEnum.Reveal);
  //           break;
  //         case 3:// right mouse click
  //           onAction(TileActionTypeEnum.Mark);
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   }, false);
  // }

  // getTileButton() {
  //   return new Promise((resolve) => {
  //     const button = document.getElementById(this.getButtonID());
  //     if (button) {
  //       resolve(button);
  //     }
  //   });
  // }

  // getTileCellContent() {
  //   return new Promise((resolve) => {
  //     const cell = document.getElementById(this.getCellID());
  //     if (cell && cell.children[0]) {
  //       resolve(cell.children[0]);
  //     }
  //   });
  // }

  // activate() {
  //   this.setActive(true);
  //   this.getTileButton().then(button => ElementHandler.addClassToElement(button, this.#styleClassList.activeTile));
  // }

  // deActivate() {
  //   this.setActive(false);
  //   this.getTileButton().then(button => ElementHandler.removeClassFromElement(button, this.#styleClassList.activeTile));
  // }

  // setRevealedView(isMineRevealed, userAction = true) {
  //   this.getTileButton().then(button => button.remove());
  //   if (isMineRevealed && userAction) {
  //     this.getTileCellContent().then(cellContent => ElementHandler.addClassToElement(cellContent, this.#styleClassList.revealedMine))
  //   }
  // }

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
