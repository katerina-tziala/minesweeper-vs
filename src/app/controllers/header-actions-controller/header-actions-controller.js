"use strict";
import { ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID } from "./header-actions-controller.constants";
import { SettingsController } from "../settings-controller/settings-controller";

export class HeaderActionsController {
  #SettingsController;

  constructor(gameSettings = false) {
    this.#SettingsController = new SettingsController(gameSettings);
    this.init();
  }

  get #clearedContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container).then(container => {
      ElementHandler.clearContent(container);
      return container;
    });
  }

  get settingsElement() {
    return this.#SettingsController.generateView();
  }

  get actions() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.settingsElement);
    return fragment;
  }

  init() {
    this.#clearedContainer.then(container => {
      // console.log(container);
      container.append(this.actions);
    });
  }


  hideGameSettings() {
    console.log("#hideGameSettings");
    console.log("animate toggle");
    this.#SettingsController.toggleGameSettingsDisplay(false);
  }

  displayGameSettings() {
    console.log("#displayGameSettings");
    console.log("animate toggle");
    this.#SettingsController.toggleGameSettingsDisplay(true);
  }

}
