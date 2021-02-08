"use strict";



import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { DOM_ELEMENT_CLASS } from "./menu.constants";
import { GameType } from "GameEnums";

import { MenuItem } from "./menu-item/menu-item";


export class Menu {
  #OfflineGameOptions;
  #OnlineOption;

  constructor() {
    this.#OnlineOption = new MenuItem(GameType.Online, this.#onOptionSelect.bind(this));
    this.#initBaseOptions();
  }

  #initBaseOptions(types = [GameType.Bot, GameType.Friend, GameType.Original]) {
    this.#OfflineGameOptions = types.map(type => new MenuItem(type, this.#onOptionSelect.bind(this)));
  }

  generateMenu() {
    console.log(self.onlineConnection.live);

    const menu = document.createElement("menu");
    menu.append(this.#OnlineOption.generateView());
    menu.append(this.#generateOfflineOptions());
    return menu;
  }

  #generateOfflineOptions() {
    const fragment = document.createDocumentFragment();
    this.#OfflineGameOptions.forEach(option => fragment.append(option.generateView()));
    return fragment;
  }



  #onOptionSelect(gameType) {
    console.log(gameType);



  }
}
