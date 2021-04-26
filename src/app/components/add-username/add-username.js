'use strict';
// import { AppLoaderHandler } from '../app-loader-handler';
// 
import './add-username.scss';
import { ElementHandler } from '../../../ui-elements/element-handler';
import { ElementGenerator } from '../../../ui-elements/element-generator';
import { ButtonGenerator } from '../../../ui-elements/button-generator/button-generator';
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
        card.append(title, form);
        return card;
    }

    onFormSubmit(data) {
       console.log(data);
    }
}
