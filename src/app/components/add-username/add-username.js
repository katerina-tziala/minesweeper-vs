'use strict';
// import { AppLoaderHandler } from '../app-loader-handler';
// 
import './add-username.scss';
import { ElementHandler } from '../../../ui-elements/element-handler';
import { ElementGenerator } from '../../../ui-elements/element-generator';
import { ButtonGenerator } from '../../../ui-elements/button-generator/button-generator';
import { DOM_ELEMENT_CLASS } from './add-username.constants';

export class AddUsername {
    #usernameInput;
    #submitButton;

    constructor() {
        console.log('AddUsername');
    }



    
    render() {
        this.#usernameInput = this.#generateInput();
        this.#submitButton = ButtonGenerator.generateTextButton('join', this.#onSubmitForm.bind(this));

        const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.component]);
        const title = ElementGenerator.generateTitleH2('join MinesweeperVS');
        const form = this.#generateForm();
        card.append(title, form);
        return card;
    }

    #generateForm() {
        const form = document.createElement('form');
        form.addEventListener('keydown', this.#onFormEnter.bind(this));
        const formActions = this.#generateFormActions();
        form.append(this.#usernameInput, formActions);
        return form;
    }

    #generateInput() {
        const input = document.createElement('app-text-input');
        input.setAttribute('name', 'username');
        input.setAttribute('leadingIcon', true);
        input.addEventListener('onValueChange', (event) => this.#onUsernameChange(event.detail));
        return input;
    }

    #generateFormActions() {
        const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.formButtons]);
        const clearButton = ButtonGenerator.generateTextButton('clear', this.#onClearForm.bind(this));
        buttonsContainer.append(clearButton, this.#submitButton);
        return buttonsContainer;
    }


    //
    #onFormEnter(event) {
        const key = event.keyIdentifier || 0;
        if (key === 13) {
            event.preventDefault();
            event.stopPropagation();
            console.log("onenter");
        }
    }

    #onUsernameChange(inputData) {
        const username = inputData.value;
        console.log('onUsernameChange', username);
        // console.log(this.#submitButton);
       
        //ElementHandler.setDisabled(this.#submitButton);
    }

    #onClearForm() {
        console.log('onClearForm');
        // console.log(this.#usernameInput);
        // console.log(this.#usernameInput.value);
    }

    #onSubmitForm() {
        console.log('onSubmitForm');
        //console.log(this.#usernameInput);
        console.log(this.#usernameInput.value);
    }
}
