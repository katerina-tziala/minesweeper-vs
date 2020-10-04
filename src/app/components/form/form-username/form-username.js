'use strict';

import './form-username.scss';

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, FIELD } from './form-username.constants';

import { Form } from '../form';

import { ElementGenerator } from '../../../utilities/element-generator';
import { AppHelper } from '../../../utilities/app-helper';

import { TextInput } from '../../user-input/text-input/text-input';

export class FormUsername extends Form {

    constructor(submitAction) {
        super(submitAction);
        this.inputControllers = new TextInput(FIELD.name, this.onInputChange.bind(this));
    }
    

    renderFormFields(form) {
        const section = this.renderFormSection();
        section.append(ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.usernameIcon));
        this.inputControllers.forEach(inputControler => section.append(inputControler.generateInput())); 
        form.append(section);
    }

    onInputChange() {
       this.toggleSubmission();
    }

    
}
