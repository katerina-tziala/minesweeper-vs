"use strict";

import "../../../styles/pages/_home.scss";

import { TYPOGRAPHY } from "../../utils/constants/typography.constants";
import { ElementGenerator } from "../../utils/element-generator";
import { ElementHandler } from "../../utils/element-handler";
import { LocalStorageHelper } from "../../utils/local-storage-helper";

import { Page } from "../page";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, MENU_CONTENT } from "./home.constants";
import { GameType } from "../../_enums/game-type.enum";

import { NOTIFICATION_MESSAGE } from "../../components/toast-notification/toast-notification.constants";

export class Home extends Page {
    constructor() {
        super();
        this.init();
    }



    init() {
        this.displayLoader();
        this.getClearedMainContainer()
            .then(mainContainer => {

                // console.log(mainContainer);
                // console.log("welcome home");
                // console.log(self.user);
                // console.log(self.settingsController.settings);
                // console.log(self.peers);
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
        console.log(gameType);
        ElementHandler.addStyleClass(menuItem, DOM_ELEMENT_CLASS.menuItem);



        menuItem.append(this.generateMenuItemIcon(gameType));
        menuItem.append(this.generateMenuItemContent(gameType));
        // ElementHandler.addClassToElement(menuitem, InterfaceConstants.classList.centeredFlexbox);
        // ElementHandler.setElementId(menuitem, menuOption.id);
        // menuitem.append(this.generateMenuItemIcon(menuOption.icon), this.generateMenuItemContent(menuOption));
        // menuitem.addEventListener("click", this.selectMenuOption.bind(this));
        return menuItem;
    }

    generateMenuItemIcon(gameType) {
        const iconStyleClass = DOM_ELEMENT_CLASS.menuItemIcon + TYPOGRAPHY.doubleHyphen + gameType;
        return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.menuItemIcon, iconStyleClass]);
    }

    generateMenuItemContent(gameType) {
        const content = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.menuItemContent]);
        const itemContent = MENU_CONTENT[gameType];
        console.log(itemContent);
        // ElementHandler.addClassToElement(content, InterfaceConstants.classList.menuitem.content);
        // const title = this.setMenuItemDetailsContent(document.createElement("h2"), menuOption, "title");
        // const details = this.setMenuItemDetailsContent(document.createElement("p"), menuOption, "details");
        // content.append(title, details);
        content.innerHTML = this.getDetailsTemplate(itemContent);
        return content;
    }


    getDetailsTemplate(content) {
        return `<h2>${content.title}</h2><p><span>${content.details}</span></p>`;
    }


    // setMenuItemDetailsContent(elementType, menuOption, key) {
    //     const element = document.createElement(elementType);
    //     ElementHandler.addClassToElement(element, InterfaceConstants.classList.menuitem[key]);
    //     ElementHandler.setElementContent(element, menuOption[key]);
    //     return element;
    //  }

    // Overridden functions
    onConnectionError(errorMessage) {
        console.log(errorMessage);
        // super.onConnectionError(errorMessage);
        // this.loginContainer.then(container => StateLoader.hide(container));
    }
}
