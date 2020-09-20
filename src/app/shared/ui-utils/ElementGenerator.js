'use strict';
import { StyleClassList } from './ui.constants';
import { ElementHandler } from './ElementHandler';
import { Typography } from '../shared/constants/typography.constants';

export class ElementGenerator {

    // static generateCenteredFlexboxContainer(additionalStyle) {
    //     const container = document.createElement('div');
    //     container.className = StyleClassList.centeredFlexbox;
    //     if (additionalStyle) {
    //         ElementHandler.addElementStyleClass(container, additionalStyle);
    //     }
    //     return container;
    // }

    static generatePlayerIcon(iconStyles = []) {
        const icon = document.createElement('div');
        const iconStyle = StyleClassList.icon.user.concat(iconStyles);
        ElementHandler.setElementClassName(icon, iconStyle.join(Typography.space));
        return icon;
    }

    static generateButton(params, action) {
        const buttonParams = { ...params };
        const button = document.createElement('button');
        button.type = 'button';
        button.className = buttonParams.className;
        if (buttonParams.id) {
            ElementHandler.setElementId(button, buttonParams.id);
        }
        if (buttonParams.ariaLabel) {
            ElementHandler.setElementAriaLabel(button, buttonParams.ariaLabel);
        }
        button.addEventListener(buttonParams.actionType, action);
        return button;
    }

    static generateTextButton(params, action) {
        const button = ElementGenerator.generateButton(params, action);
        ElementHandler.setElementContent(button, params.text);
        return button;
    }

}