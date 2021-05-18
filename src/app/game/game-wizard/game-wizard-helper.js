'use strict';
import { DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler } from 'UI_ELEMENTS';

export class GameWizardHelper {

    static generateHeader(title) {
        const header = document.createElement('h1');
        header.appendChild(this.generateTitle(title));
        ElementHandler.addStyleClass(header, DOM_ELEMENT_CLASS.header);
        return header;
    }

    static generateTitle(titleText) {
        const title = ElementGenerator.generateContainer([], DOM_ELEMENT_CLASS.headerTitle);
        title.innerHTML = titleText;
        return title;
    }

    static updateTitle(titleText) {
        const title = document.getElementById(DOM_ELEMENT_CLASS.headerTitle);
        ElementHandler.setContent(title, titleText);
    }

}
