'use strict';

import { SWITCH_BNT } from './switcher.constants';

import { ElementGenerator } from '../../../utilities/element-generator';
import { ElementHandler } from '../../../utilities/element-handler';
import { preventInteraction, clone } from '../../../utilities/utils';

import { UserInput } from '../user-input';
import './switcher.scss';

export class Switcher extends UserInput {
 
    constructor(name, value, onValueChange) {
        super(name, value, onValueChange);
        this.valid = true;
    }

    get inputParams() {
        const params = clone(SWITCH_BNT);
        params.id = this.name;
        return params;
    }

    generateInput() {
        const switcher = ElementGenerator.generateButton(this.inputParams, this.onSwitchChange.bind(this));
        this.setSwitcherState(switcher);
        return switcher;
    }

    onSwitchChange(event) {
        preventInteraction(event);
        this.value = !JSON.parse(event.target.getAttribute('aria-checked'));
        this.updateSwitcherDisplay();
        this.notifyForChanges();
    }

    setSwitcherState(switcher) {
        switcher.setAttribute('aria-checked', this.value);
    }

    updateSwitcherDisplay() {
        this.inputField.then(switcher => this.setSwitcherState(switcher));
    }

    disable() {
        this.inputField.then(switcher => ElementHandler.setDisabled(switcher, true));
    }

    enable() {
        this.inputField.then(switcher => ElementHandler.setDisabled(switcher, false));
    }

}
