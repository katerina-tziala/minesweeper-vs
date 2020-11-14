"use strict";

import { ElementHandler, AriaHandler } from "HTML_DOM_Manager";
import { extractIdValue, preventInteraction } from "~/_utils/utils";

import { DropdownSelectOption } from "./dropdown-select-option";

export class DropdownSelectNavigation {

	static manageNavigation(event, listbox, onEscape, onEnter) {
		preventInteraction(event);
		const expanded = AriaHandler.getAriaExpanded(listbox);
		const keyCode = event.keyCode || event.which;
		if (expanded) {
			const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
			const currentIndex = parseInt(extractIdValue(activeDescendantID), 10) - 1;
			const listSize = listbox.childNodes.length - 1;
			let nextIndex;
			switch (keyCode) {
				case 40: // Down Arrow
				case 39: // Right Arrow
					nextIndex = this.getNextIndex(currentIndex, listSize);
					DropdownSelectNavigation.updateListSelection(listbox, currentIndex, nextIndex);
					break;
				case 38: // Up Arrow
				case 37: // Left Arrow
					nextIndex = this.getNextIndex(currentIndex, listSize, -1);
					DropdownSelectNavigation.updateListSelection(listbox, currentIndex, nextIndex);
					break;
				case 36: // Home
					nextIndex = 0;
					DropdownSelectNavigation.updateListSelection(listbox, currentIndex, nextIndex);
					break;
				case 35: // End
					nextIndex = listSize;
					DropdownSelectNavigation.updateListSelection(listbox, currentIndex, nextIndex);
					break;
				case 13: // Enter
					onEnter(activeDescendantID);
					break;
				case 27: // Escape
					onEscape();
					break;
				case 9: // Tab
					nextIndex = this.getNextIndex(currentIndex, listSize, event.shiftKey ? -1 : 1);
					DropdownSelectNavigation.updateListSelection(listbox, currentIndex, nextIndex);
					break;
			}
		}
	}

	static updateListSelection(listbox, currentIndex, nextIndex) {
		const options = listbox.childNodes;
		DropdownSelectOption.deselectOption(options[currentIndex]);
		DropdownSelectOption.selectOption(options[nextIndex]);
		AriaHandler.setActiveDescendant(listbox, ElementHandler.getID(options[nextIndex]));
	}

	static getNextIndex(currentIndex, listSize, step = 1) {
		let nextIndex = currentIndex + step;
		return nextIndex > listSize ? 0 : (nextIndex < 0) ? listSize : nextIndex;
	}

}
