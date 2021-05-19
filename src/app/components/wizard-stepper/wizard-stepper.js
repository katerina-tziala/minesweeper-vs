'use strict';
import './wizard-stepper.scss';
import { ElementGenerator, ButtonGenerator, ElementHandler } from 'UI_ELEMENTS';
import { DOM_ELEMENT_CLASS, CONTENT } from './wizard-stepper.constants';

export class WizardStepper {

    constructor() {
        this.steps = [];

    }

    generate() {
        const stepper = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.component], DOM_ELEMENT_CLASS.component);
        const container = this.#generateStepsContainer();
        this.#renderSteps(container);

        console.log('WizardStepper');

        stepper.append(container);
        return stepper;
    }

    #generateStepsContainer() {
        return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    }

    get #stepsContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
    }

    #renderSteps(container) {
        //const container = this.#stepsContainer;
        if (container && this.steps.length) {
            console.log('renderSteps');

            console.log(this.steps);
        }

    }




}
