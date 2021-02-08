"use strict";
import { setAppTheme } from "../../_utils/theming";
import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";
import { Switcher } from "UserInputs";
import { AppSettingsModel } from "~/_models/app-settings";
import { Theme } from "~/_enums/app-settings.enums";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, BUTTON } from "./online-indicator-controller.constants";
import { SettingsItem } from "../../components/settings-item/settings-item";
import { Toggle } from "../../components/toggle/toggle";
import { GameSettings } from "../../components/game-settings/game-settings";

export class OnlineIndicator {


  constructor() {
    console.log("OnlineIndicatorController");

    this.live = self.onlineConnection ? self.onlineConnection.live : false;
    console.log(self.onlineConnection.live);
  }

  get #container() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }


  generateView() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
    container.append(this.#connectedState);
    return container;
  }

  get #connectedState() {
    return this.live ? this.#generatedIcon : this.#generatedButton;
  }

  get #generatedIcon() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.icon]);
  }

  get #generatedButton() {
    return ElementGenerator.generateButton(BUTTON, this.#onConnect.bind(this));
  }

  #onConnect() {
    console.log("#onConnect");

  }






}
