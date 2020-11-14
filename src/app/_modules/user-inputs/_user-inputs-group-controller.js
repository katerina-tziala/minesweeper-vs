"use strict";

export class UserInputsGroupController {
	#inputControllers = {};

	constructor() {
	}

	set inputControllers(controller) {
		delete this.#inputControllers[controller.name];
		this.#inputControllers[controller.name] = controller;
	}

	get inputControllers() {
		return Object.values(this.#inputControllers);
	}

    get isValid() {
		return this.inputControllers.every(inputController => inputController.valid);
    }

	get inputData() {
        if (this.isValid) {
            const data = {};
            this.inputControllers.forEach(input => data[input.name] = input.value);
            return data;
        }
        return undefined;
	}

	getInputController(key) {
		return this.#inputControllers[key];
	}

}
