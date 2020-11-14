"use strict";

import "../../../styles/pages/_home.scss";

import { TYPOGRAPHY } from "../../_utils/constants/typography.constants";
import { ElementGenerator } from "../../_utils/element-generator";
import { ElementHandler } from "../../_utils/element-handler";
import { AriaHandler } from "../../_utils/aria-handler";

import { Page } from "../page";
import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./home-page.constants";
import { GameType } from "../../_enums/game-type.enum";

export class HomePage extends Page {
    constructor(selectGameType) {
        super();
        self.settingsController.gameSettingsHidden = false;
        this.init();
        this.selectGameType = selectGameType;
    }

    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {
                mainContainer.append(this.generateMenu());
                this.hideLoader();
            });
    }

    generateMenu() {
        const menu = document.createElement("menu");
        ElementHandler.addStyleClass(menu, DOM_ELEMENT_CLASS.menu);
        Object.values(GameType).forEach(gameType => menu.append(this.generateMenuItem(gameType)));
        return menu;
    }

    generateMenuItem(gameType) {
        const menuItem = document.createElement("menuitem");
        ElementHandler.addStyleClass(menuItem, DOM_ELEMENT_CLASS.menuItem);
        AriaHandler.setTabindex(menuItem, 1);
        menuItem.append(this.generateMenuItemIcon(gameType));
        menuItem.append(this.generateMenuItemContent(gameType));
        menuItem.addEventListener("click", () => this.selectGameType(gameType));
        menuItem.addEventListener("keydown", (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                this.selectGameType(gameType);
            }
        });
        return menuItem;
    }

    generateMenuItemIcon(gameType) {
        const iconStyleClass = DOM_ELEMENT_CLASS.menuItemIcon + TYPOGRAPHY.doubleHyphen + gameType;
        return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.menuItemIcon, iconStyleClass]);
    }

    generateMenuItemContent(gameType) {
        const content = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.menuItemContent]);
        const itemContent = MENU_CONTENT[gameType];
        content.innerHTML = `<h2>${itemContent.title}</h2><p><span>${itemContent.details}</span></p>`;
        return content;
    }

    // Overridden functions
    onConnectionError(errorMessage) {
        console.log(errorMessage);
        // super.onConnectionError(errorMessage);
    }
}
