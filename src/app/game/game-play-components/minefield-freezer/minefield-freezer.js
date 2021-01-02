"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { uniqueArray, arrayDifference } from "~/_utils/utils";

import { preventInteraction } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./minefield-freezer.constants";
import { IconLoader } from "~/components/loaders/icon-loader/icon-loader";

export class MinefieldFreezer {
  //#_levelSettings;
  #_gameId;
  // #_disabled = true;

  constructor(gameId) {
    this.#gameId = gameId;
  }

  set #gameId(gameID) {
    this.#_gameId = gameID;
  }

  get #gameId() {
    return this.#_gameId;
  }

  // set #disabled(disabled) {
  //   this.#_disabled = disabled;
  // }

  // get #disabled() {
  //   return this.#_disabled;
  // }

  get freezerId() {
    return DOM_ELEMENT_ID.freezer + this.#gameId;
  }

  get #freezer() {
    return ElementHandler.getByID(this.freezerId);
  }




  generateView() {
    // this.#disabled = true;
    const boardFreezer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.freezer],
      this.freezerId,
    );
    boardFreezer.addEventListener("click", (event) => preventInteraction(event));
    return boardFreezer;
  }

  displayLoader(colorType) {
    return this.#freezer.then((freezer) => {
      freezer.append(IconLoader.generate(colorType));
      ElementHandler.display(freezer);
    });
  }



  // set freezerState(display) {
  //   this.#freezer.then((freezer) => {
  //     display ? ElementHandler.display(freezer) : ElementHandler.hide(freezer);
  //     if (!display) {
  //       ElementHandler.clearContent(freezer);
  //     }
  //   });
  // }
  
  display() {
    return this.#freezer.then((freezer) => ElementHandler.display(freezer));
  }

  hide() {
    return this.#freezer.then((freezer) => {
      ElementHandler.clearContent(freezer);
      ElementHandler.hide(freezer);
    });
  }

  // set freezerState(display) {
  //   this.#freezer.then((freezer) => {
  //     display ? ElementHandler.display(freezer) : ElementHandler.hide(freezer);
  //     if (!display) {
  //       ElementHandler.clearContent(freezer);
  //     }
  //   });
  // }


  // disable() {
  //   this.hide();
  // }

  // enable() {
  //   this.#disabled = false;
  // }



}
