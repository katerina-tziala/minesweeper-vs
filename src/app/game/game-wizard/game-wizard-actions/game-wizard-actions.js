'use strict';
import {ElementHandler, ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, BUTTON_TYPES, BUTTON_TEXT } from './game-wizard-actions.constants';

export class GameWizardActions {
    #actions = {};
    #buttonsIndex = new Map();
    #finalStepIndex = 0;
    #currentIndex = 0;

    constructor(actions) {
        this.#actions = actions;
    }

    get #stepsHandling() {
        return this.#actions.next && this.#actions.previous ? true : false;
    }

    generate() {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonsContainer]);
        const buttons = this.#stepsHandling ? this.#generateStepsHandlingButtons() : this.#generateBasicButtons();
        container.append(buttons);
        return container;
    }

    init(finalStepIndex, currentIndex = 0) {
        if (!this.#stepsHandling) {
            return;
        }
        ElementHandler.setDisabled(this.#buttonsIndex.get(BUTTON_TYPES.reset), false);
        this.#finalStepIndex = finalStepIndex;

        this.onIndexUpdate(currentIndex);
    }

    onIndexUpdate(currentIndex = 0) {
        this.#currentIndex = currentIndex;
        this.#checkPreviousButton();
        this.#checkNextButton();
        this.#checkPlayButton();
    }

    #generateStepsHandlingButtons() {
        const fragment = document.createDocumentFragment();
        const previousButton = this.#generateButton(BUTTON_TYPES.previous);
        const resetButton = this.#generateButton(BUTTON_TYPES.reset);
        const nextButton = this.#generateButton(BUTTON_TYPES.next);
        const playButton = this.#generateButton(BUTTON_TYPES.play);
        ElementHandler.hide(playButton);
        fragment.append(previousButton, resetButton, nextButton, playButton);
        return fragment;
    }

    #generateBasicButtons() {
        const fragment = document.createDocumentFragment();
        const resetButton = this.#generateButton(BUTTON_TYPES.reset);
        const playButton = this.#generateButton(BUTTON_TYPES.play);
        fragment.append(resetButton, playButton);
        return fragment;
    }

    #generateButton(type) {
        const button = ButtonGenerator.generateTextButton(BUTTON_TEXT[type], this.#actions[type]);
        ElementHandler.addStyleClass(button, type);
        ElementHandler.setDisabled(button, this.#stepsHandling);
        this.#buttonsIndex.set(type, button);
        return button;
    }

    #checkPreviousButton() {
        const button = this.#buttonsIndex.get(BUTTON_TYPES.previous);
        const disabled = this.#currentIndex === 0;
        ElementHandler.setDisabled(button, disabled);
    }

    #checkNextButton() {
        const button = this.#buttonsIndex.get(BUTTON_TYPES.next);
        const displayed = this.#currentIndex !== this.#finalStepIndex;
        displayed ? ElementHandler.display(button) : ElementHandler.hide(button);
        ElementHandler.setDisabled(button, !displayed);
    }

    #checkPlayButton() {
        const button = this.#buttonsIndex.get(BUTTON_TYPES.play);
        const displayed = this.#currentIndex === this.#finalStepIndex;
        displayed ? ElementHandler.display(button) : ElementHandler.hide(button);
        ElementHandler.setDisabled(button, !displayed);
    }

}
