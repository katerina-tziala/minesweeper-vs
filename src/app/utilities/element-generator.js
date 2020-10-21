'use strict';

import { ElementHandler } from './element-handler';

export class ElementGenerator {

    static generateContainer(containerClass) {
        const container = document.createElement('div');
        ElementHandler.addStyleClass(container, containerClass);
        return container;
    }

    static generateButton(params, action) {
        params = { ...params };
        
        const button = document.createElement('button');
        button.type = 'button';

        button.addEventListener(params.actionType, action);
        delete params.actionType;

        ElementHandler.setAttributes(button, params);
        return button;
    }

}
