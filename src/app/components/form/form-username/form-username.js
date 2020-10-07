'use strict';

import { ElementGenerator } from '../../../utilities/element-generator';

import { Form } from '../form';
import { TextInput } from '../../user-input/text-input/text-input';

import { DOM_ELEMENT_CLASS, FIELD } from './form-username.constants';

import './form-username.scss';

export class FormUsername extends Form {

    constructor(submitAction) {
        super(submitAction);
        this.inputControllers = new TextInput(FIELD, this.onInputChange.bind(this));
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
