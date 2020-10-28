"use strict";

import "./dropdown.scss";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT } from "./dropdown.constants";

import { ElementGenerator } from "../../../utilities/element-generator";
import { ElementHandler } from "../../../utilities/element-handler";
import { preventInteraction, clone, replaceStringParameter } from "../../../utilities/utils";

import { UserInput } from "../user-input";
import { DropdownButton } from "./dropdown-button/dropdown-button";
import { DropdownList } from "./dropdown-list/dropdown-list";

export class Dropdown extends UserInput {
	#selectLabel;
	#options;
	#expanded;
	constructor(params, onValueChange) {
		super(params.name, params.value, onValueChange);
		this.valid = true;
		this.selectLabel = params.selectLabel;
		this.expanded = false;
		this.options = params.options || [];
		this.dropdownBtn = new DropdownButton(this.name);
		this.dropdownList = new DropdownList(this.name);

		//console.log(this);
	}



	get options() {
		return this.#options;
	}

	set options(options) {
		this.#options = options;
	}

	get selectLabel() {
		return this.#selectLabel;
	}

	set selectLabel(selectLabel) {
		this.#selectLabel = selectLabel;
	}

	get containerID() {
		return DOM_ELEMENT_ID.dropdownContainer + this.name;
	}

	get selectText() {
		return this.selectLabel ? replaceStringParameter(CONTENT.selectText, this.selectLabel) : CONTENT.defaultSelectText;
	}

	set expanded(expanded) {
		this.#expanded = expanded;
	}

	get expanded() {
		return this.#expanded;
	}

	get btnDisabled() {
		return this.options.length ? false : true;
	}

	get btnDisplayValue() {
		const selectedOption = this.selectedOption;
		return selectedOption ? selectedOption.label : this.selectText;
	}

	get selectedOption() {
		return this.options.find(option => option.value === this.value);
	}

	generateInput() {
		const dorpdownFragment = document.createDocumentFragment();
		const dropdownContainer = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.container);
		ElementHandler.setID(dropdownContainer, this.containerID);

		const button = this.generateDropdownButton();
		const listBox = this.dropdownList.generateDropdownListbox(this.options, this.selectText);



		dropdownContainer.append(button, listBox);
		dorpdownFragment.append(dropdownContainer);

		return dorpdownFragment;
	}




	generateDropdownButton() {
		const dropdownParams = {
			displayValue: this.btnDisplayValue,
			expanded: this.btnDisabled ? false : this.expanded,
			disabled: this.btnDisabled
		};
		return this.dropdownBtn.generateDropdownBtn(dropdownParams, this.onDropDownClick.bind(this));
	}

	onDropDownClick() {
		//console.log("onDropDownClick");
		this.expanded = !this.expanded;
		this.dropdownBtn.updateExpandedAttribute(this.expanded);
		this.dropdownList.toggleList(this.expanded);
	}



	
}
