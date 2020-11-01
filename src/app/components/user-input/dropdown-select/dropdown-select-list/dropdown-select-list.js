"use strict";

import { ElementGenerator } from "../../../../utilities/element-generator";
import { ElementHandler } from "../../../../utilities/element-handler";
import { AriaHandler } from "../../../../utilities/aria-handler";
import { clone } from "../../../../utilities/utils";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, LISTBOX_ATTRIBUTES } from "../dropdown-select.constants";

import { DropdownSelectOptionsHandler } from "../dropdown-select-options-handler";
import { DropdownSelectOption } from "../dropdown-select-option/dropdown-select-option";
import { DropdownSelectNavigation } from "./dropdown-select-navigation";

export class DropdownSelectList {
	#listboxId;
	#maxHeight;
	#listHeight;
	#size;

	constructor(onSelection, name, maxHeight = 150) {
		this.onSelection = onSelection;
		this.listboxID = name;
		this.maxHeight = maxHeight;
		this.listHeight = 0;
	}

	set size(size) {
		this.#size = size;
	}

	get size() {
		return this.#size;
	}

	set maxHeight(maxHeight) {
		this.#maxHeight = maxHeight;
	}

	set listHeight(height) {
		this.#listHeight = height > this.maxHeight ? this.maxHeight : height;
	}

	set listboxID(name) {
		this.#listboxId = DOM_ELEMENT_ID.listbox + name;
	}

	get maxHeight() {
		return this.#maxHeight;
	}

	get listHeight() {
		return this.#listHeight;
	}

	get listboxID() {
		return this.#listboxId;
	}

	get listbox() {
		return ElementHandler.getByID(this.listboxID);
	}

	get isScrollable() {
		return this.listHeight === this.maxHeight;
	}

	setUpListHeight(listbox) {
		this.listHeight = DropdownSelectOptionsHandler.getOptionsHeight(listbox.childNodes);
		this.isScrollable ? ElementHandler.addStyleClass(listbox, DOM_ELEMENT_CLASS.listboxScrollable) : ElementHandler.removeStyleClass(listbox, DOM_ELEMENT_CLASS.listboxScrollable);
	}

	getListBoxAttributes(options, selectText) {
		const selectedOption = DropdownSelectOptionsHandler.getSelectedOptionBySelected(options);
		const attributes = clone(LISTBOX_ATTRIBUTES);
		attributes["id"] = this.listboxID;
		attributes["aria-label"] = selectText;
		if (selectedOption) {
			attributes["aria-activedescendant"] = selectedOption.attributes.id;
		}
		return attributes;
	}

	generateDropdownListbox(options, selectText) {
		const listboxContainer = ElementGenerator.generateContainer(DOM_ELEMENT_CLASS.listboxContainer);
		const attributes = this.getListBoxAttributes(options, selectText);
		const listBox = this.generateOptionsListbox(options, attributes);
		AriaHandler.setTabindex(listBox, -1);
		listboxContainer.append(listBox);
		return listboxContainer;
	}

	generateOptionsListbox(options, attributes) {
		const listBox = document.createElement("ul");
		listBox.className = DOM_ELEMENT_CLASS.listbox;
		listBox.addEventListener("keydown", (event) => DropdownSelectNavigation.manageNavigation(event, listBox, this.onEscape.bind(this), this.onEnter.bind(this)));
		ElementHandler.setAttributes(listBox, attributes);
		listBox.append(DropdownSelectOptionsHandler.generateOptionsList(options, this.onOptionClick.bind(this)));
		return listBox;
	}

	onEscape() {
		this.toggleList(false);
		this.onSelection();
	}

	onEnter(activeDescendantID) {
		ElementHandler.getByID(activeDescendantID).then(activeDescendant => this.submitSelectedOption(activeDescendant));
	}

	clearCurrentSelectedOption() {
		this.listbox.then(listbox => {
			const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
			return ElementHandler.getByID(activeDescendantID);
		}).then(activeDescendant => DropdownSelectOption.deselectOption(activeDescendant));
	}

	setActiveDescendant(activeDescendantID) {
		this.listbox.then(listbox => AriaHandler.setActiveDescendant(listbox, activeDescendantID));
	}

	onOptionClick(selectedOption) {
		this.clearCurrentSelectedOption();
		this.setActiveDescendant(ElementHandler.getID(selectedOption));
		this.submitSelectedOption(selectedOption);
	}

	submitSelectedOption(selectedOption) {
		this.toggleList(false);
		this.onSelection(selectedOption.getAttribute("value"));
	}

	toggleList(expanded, selectedOption) {
		this.listbox.then(listbox => {
			if (!this.listHeight) {
				this.setUpListHeight(listbox);
			}
			expanded ? this.expandList(listbox, selectedOption) : this.collapseList(listbox);
		});
	}

	expandList(listbox, selectedOption) {
		listbox.style.height = `${this.listHeight}px`;
		AriaHandler.setAriaExpanded(listbox, true);
		AriaHandler.setListTabindex(listbox.childNodes, 0);
		const activeDescendantID = selectedOption.attributes.id;
		AriaHandler.setActiveDescendant(listbox, activeDescendantID);
		ElementHandler.getByID(activeDescendantID).then(activeDescendant => {
			DropdownSelectOption.selectOption(activeDescendant);
			listbox.scrollTop = activeDescendant.getBoundingClientRect().top;
		});
	}

	collapseList(listbox) {
		listbox.style.height = "0px";
		AriaHandler.setAriaExpanded(listbox, false);
		AriaHandler.setListTabindex(listbox.childNodes, -1);
		const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
		ElementHandler.getByID(activeDescendantID).then(activeDescendant => {
			DropdownSelectOption.deselectOption(activeDescendant);
		});
	}

	collapseListOnOutsideClick() {
		this.listbox.then(listbox => {
			const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
			ElementHandler.getByID(activeDescendantID).then(activeDescendant => this.submitSelectedOption(activeDescendant));
		});
	}
}
