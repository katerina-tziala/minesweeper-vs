"use strict";

import {
  ElementHandler,
  ElementGenerator
} from "HTML_DOM_Manager";

import { SettingsItem } from "~/components/settings-item/settings-item";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  CONTENT
} from "./settings-controller-view-helper.constants";


export class SettingsControllerViewHelper {

  static #generateHeader() {
    const header = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.header]);
    header.innerHTML = CONTENT.header;
    return header;
  }

  static #generateThemeSwitcher(controller) {
    return SettingsItem.generateItem(controller);
  }

  static #generateContentContainer() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_ID.content], DOM_ELEMENT_CLASS.content);
  }

  static setAppTheme(settings) {
    const appStyles = [DOM_ELEMENT_CLASS.app];
    appStyles.push(`${DOM_ELEMENT_CLASS.theme}${settings.theme}`);
    return ElementHandler.getByID(DOM_ELEMENT_ID.app).then(appContainer => {
      ElementHandler.setStyleClass(appContainer, appStyles);
      return;
    });
  }

  static getContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.container);
  }

  static getContentContainer() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.content);
  }

  static generateToggleContainer(themeController, gameSettingsController) {
    const container = SettingsControllerViewHelper.#generateContentContainer();
    const header = SettingsControllerViewHelper.#generateHeader();
    const themeSwitcher = SettingsControllerViewHelper.#generateThemeSwitcher(themeController);
    container.append(header, themeSwitcher);
    if (gameSettingsController) {
      container.append(gameSettingsController.generateView());
    }
    return container;
  }

}
