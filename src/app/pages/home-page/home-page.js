"use strict";

import "../../../styles/pages/_home.scss";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { Page } from "../page";
import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./home-page.constants";
import { GameType } from "GameEnums";
import { HeaderActionsControllerUser } from "../../controllers/header-actions-controller/header-actions-controller-user";
import {
  Menu
} from "../../components/menu/menu";

export class HomePage extends Page {
  #Menu;

  constructor(selectGameType) {
    super();
    this.selectGameType = selectGameType;
    this.#Menu = new Menu();
    this.actionControlller = new HeaderActionsControllerUser(true, {
      "onLogout": this.onLogout.bind(this)
    });
    this.init();
 
  }

  renderPage(mainContainer) {
    mainContainer.append(this.#Menu.generateMenu());


    setTimeout(() => {

    }, 2000);


    this.hideLoader();
  }

  
  // Overridden functions
  onConnectionError(errorMessage) {
    console.log(errorMessage);
    // super.onConnectionError(errorMessage);
  }
}
