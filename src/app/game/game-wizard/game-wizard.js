'use strict';
import './game-wizard.scss';
import { GameType } from 'GAME_ENUMS';
import { HEADER, DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler, ButtonGenerator, CustomElementHelper } from 'UI_ELEMENTS';
import { GameWizardOriginal } from './game-wizard-original/game-wizard-original';

import { GameWizardVS } from './game-wizard-vs/game-wizard-vs';

export default class GameWizard {

    constructor() {
        this.type = GameType.Original;
        //this.wizardHandler = new GameWizardOriginal(this.#onPlay.bind(this));

        this.wizardHandler = new GameWizardVS(this.#onPlay.bind(this));



    }

    get wizardContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.wizard);
    }

    render() {
        const wizard = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizard], DOM_ELEMENT_CLASS.wizard);
        const button = ButtonGenerator.generateIconButtonClose(this.#onClose.bind(this));
        const content = this.wizardHandler.generate();
        wizard.append(button, content);
        return wizard;
    }

    init() {
        this.wizardHandler.init();
    }

    #onClose() {
        console.log('onClose');
    }

    #onPlay(gameConfig) {
        console.log('onPlay');
        console.log(gameConfig);
        const container = this.wizardContainer;
        ElementHandler.addStyleClass(container, DOM_ELEMENT_CLASS.wizardOut);
    }
}
