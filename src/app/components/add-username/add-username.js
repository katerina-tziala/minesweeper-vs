'use strict';
import './add-username.scss';
import { ElementHandler, ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS } from './add-username.constants';
import { UsernameForm } from './username-form/username-form';

export class AddUsername {
    #form;

    constructor() {
        console.log('AddUsername');
        this.#form = new UsernameForm(this.onFormSubmit.bind(this));
        this.#form.init('add player', 'kate')
    }

    render() {
        const card = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.component]);
        const title = ElementGenerator.generateTitleH2('join MinesweeperVS');
        const form = this.#form.generate();

        const closeButton = ButtonGenerator.generateIconButtonClose(() => {
            console.log("on clo");
        });
        card.append(closeButton);

        card.append(title, form);
        return card;
    }

    onFormSubmit(data) {
       console.log(data);
    }
}
