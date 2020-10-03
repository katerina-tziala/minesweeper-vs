'use strict';

import { ElementHandler } from './element-handler';

export class ElementGenerator {

    static generateContainer(containerClass) {
        const container = document.createElement('div');
        ElementHandler.addStyleClass(container, containerClass);
        return container;
    }

    static generateButton(params, action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = params.className;
        if (params.id) {
            ElementHandler.setID(button, params.id);
        }
        if (params.ariaLabel) {
            ElementHandler.setAriaLabel(button, buparamsttonParams.ariaLabel);
        }
        button.addEventListener(params.actionType, action);
        return button;
    }

    static generateTextButton(params, action) {
        const button = ElementGenerator.generateButton(params, action);
        ElementHandler.setContent(button, params.text);
        return button;
    }

}