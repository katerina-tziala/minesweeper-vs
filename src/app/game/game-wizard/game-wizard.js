'use strict';
import './game-wizard.scss';
import { GameType } from 'GAME_ENUMS';
import { HEADER, DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler, ButtonGenerator } from 'UI_ELEMENTS';
import { GameWizardHelper } from './game-wizard-helper';

export class GameWizard {
    #onPlay;
    #onCancel;

    constructor(onPlay, onCancel) {
        this.#onPlay = onPlay;
        this.#onCancel = onCancel;
    }

    get wizardContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.wizard);
    }

    render() {
        const wizard = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizard], DOM_ELEMENT_CLASS.wizard);
        const button = ButtonGenerator.generateIconButtonClose(this.onClose.bind(this));
        const header = GameWizardHelper.generateHeader(this.header);
        wizard.append(button, header, this.generateContent());
        return wizard;
    }

    generateContent() {
        return document.createDocumentFragment();
    }


    init() {
        //this.wizardHandler.init();
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


    onReset() {
        console.log('-- reset wizard');
        // TODO reset storage
        this.init();
    }
}
