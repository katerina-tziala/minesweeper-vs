"use strict";

import { DOM_ELEMENT_CLASS, OPTION_ATTRIBUTES } from "../dropdown-select.constants";

import { preventInteraction, clone, replaceStringParameter } from "../../../../utilities/utils";
import { ElementHandler } from "../../../../utilities/element-handler";
import { AriaHandler } from "../../../../utilities/aria-handler";

export class DropdownSelectOption {

	static selectOption(optionElement) {
		AriaHandler.setAriaSelected(optionElement);
		optionElement.focus();
	}

	static deselectOption(optionElement) {
		AriaHandler.removeAriaSelected(optionElement);
		optionElement.blur();
	}

	static generateSelectOption(selectOption, action) {
		const option = document.createElement("li");
		ElementHandler.setParams(option, selectOption);
		option.addEventListener("click", (event) => {
			preventInteraction(event);
			action(option);
		});
		option.addEventListener("mousein", () => option.focus());
		return option;
	}

	static getDropdownSelectOption(option, position, fieldName, value, size) {
		const innerHTML = option.innerHTML;
		const className = DOM_ELEMENT_CLASS.listboxOption;
		const attributes = clone(OPTION_ATTRIBUTES);
		attributes["value"] = option.value;
		attributes["id"] = DropdownSelectOption.generateSelectOptionId(attributes.id, fieldName, position);
		attributes["aria-setsize"] = size;
		attributes["aria-posinset"] = position;
		if (option.value === value) {
			attributes["aria-selected"] = true;
		}
		return { innerHTML, className, attributes };
	}

	static generateSelectOptionId(id, fieldName, position) {
		let optionId = replaceStringParameter(id, fieldName.toLowerCase());
		optionId += position;
		return optionId;
	}

}
