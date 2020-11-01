"use strict";

import { DropdownSelectOption } from "./dropdown-select-option";

export class DropdownSelectOptionsHandler {

	static getOptionsListSize(options) {
		return options.length;
	}

	static getSelectOptions(options, fieldName, value) {
		const size = DropdownSelectOptionsHandler.getOptionsListSize(options);
		return options.map((option, index) => {
			const position = index + 1;
			return DropdownSelectOption.getDropdownSelectOption(option, position, fieldName, value, size);
		});
	}

	static generateOptionsList(selectOptions, action) {
		const fragment = document.createDocumentFragment();
		selectOptions.forEach((selectOption) => {
			const option = DropdownSelectOption.generateSelectOption(selectOption, action);
			fragment.append(option);
		});
		return fragment;
	}

	static getOptionsHeight(options) {
		let height = 0;
		options.forEach(option => height += option.getBoundingClientRect().height);
		return height;
	}

	static getSelectedOptionBySelected(options) {
		return options.find(option => option.attributes["aria-selected"]);
	}

	static getSelectedOptionByValue(options, value) {
		return options.find(option => option.attributes["value"] === value);
	}
}