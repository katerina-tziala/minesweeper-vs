'use strict';
import './game-wizard.scss';
import { HEADER, DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler, ButtonGenerator } from 'UI_ELEMENTS';
import { LocalStorageHelper } from 'UTILS';
import { GameWizardHelper } from './game-wizard-helper';

export class GameWizard {
    type;
    actionsHandler;
    #onComplete;
    #onCancel;

    constructor() {
    }

    set onCancel(onCancel) {
        this.#onCancel = onCancel;
    }

    set onComplete(onComplete) {
        this.#onComplete = onComplete;
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
        this.#moveOutWizard();
        this.#clearWizardSettings();
        if (this.#onCancel) {
            this.#onCancel();
        }
    }

    onPlayGame(gameConfig) {
        this.#moveOutWizard();
        if (this.#onComplete) {
            this.#onComplete(gameConfig);
        }
    }

    #moveOutWizard() {
        ElementHandler.addStyleClass(this.wizardContainer, DOM_ELEMENT_CLASS.wizardOut);
    }

    #clearWizardSettings() {
        if (this.type) {
            LocalStorageHelper.deleteGameSetUp(this.type);
        }
    }
}
