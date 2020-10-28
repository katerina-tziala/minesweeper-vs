"use strict";

import "./dropdown-list.scss";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT } from "./dropdown-list.constants";

import { ElementGenerator } from "../../../../utilities/element-generator";
import { ElementHandler } from "../../../../utilities/element-handler";
import { preventInteraction, clone, replaceStringParameter } from "../../../../utilities/utils";



export class DropdownList {
	#listboxId;

	constructor(name) {
		this.listboxID = name;
		console.log(this);
	}

	set listboxID(name) {
		this.#listboxId = DOM_ELEMENT_ID.listbox + name;
	}

	get listboxID() {
		return this.#listboxId;
	}

	get listbox() {
		return ElementHandler.getByID(this.listboxID);
	}

	generateDropdownListbox(options, selectText) {
		const listBox = document.createElement("ul");
		listBox.className = DOM_ELEMENT_CLASS.listbox;
		ElementHandler.setID(listBox, this.listboxID);
		ElementHandler.setRole(listBox, "listbox");
		ElementHandler.setTabindex(listBox, -1);
		ElementHandler.setAriaLabel(listBox, selectText);
		listBox.append(this.generateListboxOptions(options));
		return listBox;
	}


	generateListboxOptions(options) {
		const fragment = document.createDocumentFragment();
		options.forEach(option => {
			const optionElement = document.createElement("li");
			ElementHandler.setRole(optionElement, "option");
			ElementHandler.addStyleClass(optionElement, DOM_ELEMENT_CLASS.listboxOption);
			ElementHandler.setTabindex(optionElement, 1);
			optionElement.innerHTML = option.label;

			console.log(option);


			fragment.append(optionElement);
		});
		return fragment;
	}


	toggleList(expanded) {
		this.listbox.then(listbox => {
			ElementHandler.setTabindex(listbox, 1);
			expanded ? ElementHandler.addStyleClass(listbox, DOM_ELEMENT_CLASS.listboxExpanded) : ElementHandler.removeStyleClass(listbox, DOM_ELEMENT_CLASS.listboxExpanded);
		});
	}




}
