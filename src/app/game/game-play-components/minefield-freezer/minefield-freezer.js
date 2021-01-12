"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { preventInteraction } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./minefield-freezer.constants";
import { IconLoader } from "~/components/loaders/icon-loader/icon-loader";

export class MinefieldFreezer {
  #_gameId;

  constructor(gameId) {
    this.#gameId = gameId;
  }

  set #gameId(gameID) {
    this.#_gameId = gameID;
  }

  get #gameId() {
    return this.#_gameId;
  }

  get freezerId() {
    return DOM_ELEMENT_ID.freezer + this.#gameId;
  }

  get #freezer() {
    return ElementHandler.getByID(this.freezerId);
  }

  generateView() {
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

  display() {
    return this.#freezer.then((freezer) => ElementHandler.display(freezer));
  }

  hide() {
    return this.#freezer.then((freezer) => {
      ElementHandler.clearContent(freezer);
      ElementHandler.hide(freezer);
    });
  }

}
