'use strict';
import './game-wizard.scss';
import { GameType } from 'GAME_ENUMS';
import { HEADER, DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler, ButtonGenerator } from 'UI_ELEMENTS';
import { GameWizardHelper } from './game-wizard-helper';

export class GameWizard {

    type;
    actionsHandler;


    #onPlay;
    #onCancel;
    constructor(onPlay, onCancel) {
        this.#onPlay = onPlay;
        this.#onCancel = onCancel;
    }

    get wizardId() {
        return DOM_ELEMENT_CLASS.wizard;
    }

    get wizardContainer() {
        return document.getElementById(this.wizardId);
    }

    get contentContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.wizardContent);
    }


    setHeaderText() {
        this.header = HEADER[this.type];
    }

    render() {
        const wizard = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizard], this.wizardId);
        const button = ButtonGenerator.generateIconButtonClose(this.onClose.bind(this));
        const header = GameWizardHelper.generateHeader(this.header);
        const content = this.generateContent();
        wizard.append(button, header, content);
        return wizard;
    }

    generateContentContainer() {
        return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
    }

    generateContent() {
        return document.createDocumentFragment();
    }

    init() {
        if (this.actionsHandler) {
            this.actionsHandler.init();
        }
    }

    onClose() {
        console.log('onClose');
    }

    onPlayGame(gameConfig) {
        console.log('onPlayGame');
        console.log(gameConfig);
        const container = this.wizardContainer;
        ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.wizardOut);
    }

}
