'use strict';
import { DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler } from 'UI_ELEMENTS';

export class GameWizardHelper {

    static generateWizardCard() {
        return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizard]);
    }

    static generateHeader(title) {
        const header = ElementGenerator.generateHeader(title);
        ElementHandler.addStyleClass(header, DOM_ELEMENT_CLASS.header);
        return header;
    }

    static generateTitle(titleText) {
        return `<div id ='${DOM_ELEMENT_CLASS.headerTitle}'>${titleText}</div`;
    }

    static updateTitle(titleText) {
        const title = document.getElementById(DOM_ELEMENT_CLASS.headerTitle);
        ElementHandler.setContent(title, titleText);
    }

}
