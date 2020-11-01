"use strict";

import { ElementHandler } from "../../../utilities/element-handler";
import { AriaHandler } from "../../../utilities/aria-handler";
import { extractIdValue, preventInteraction } from "../../../utilities/utils";

import { DropdownSelectOption } from "./dropdown-select-option";

export class DropdownSelectNavigation {

	static manageNavigation(event, listBox, onEscape, onEnter) {
		preventInteraction(event);
		const expanded = AriaHandler.getAriaExpanded(listBox);
		const keyCode = event.which;
		if (expanded) {
			const activeDescendantID = AriaHandler.getActiveDescendant(listBox);
			const currentIndex = parseInt(extractIdValue(activeDescendantID), 10) - 1;
			const listSize = listBox.childNodes.length - 1;
			let nextIndex;
			switch (keyCode) {
				case 40: // Down Arrow
				case 39: // Right Arrow
					nextIndex = this.getNextIndex(currentIndex, listSize);
					DropdownSelectNavigation.updateListSelection(listBox, currentIndex, nextIndex);
					break;
				case 38: // Up Arrow
				case 37: // Left Arrow
					nextIndex = this.getNextIndex(currentIndex, listSize, -1);
					DropdownSelectNavigation.updateListSelection(listBox, currentIndex, nextIndex);
					break;
				case 36: // Home
					nextIndex = 0;
					DropdownSelectNavigation.updateListSelection(listBox, currentIndex, nextIndex);
					break;
				case 35: // End
					nextIndex = listSize;
					DropdownSelectNavigation.updateListSelection(listBox, currentIndex, nextIndex);
					break;
				case 13: // Enter
					onEnter(activeDescendantID);
					break;
				case 27: // Escape
					onEscape();
					break;
				case 9: // Tab
					nextIndex = this.getNextIndex(currentIndex, listSize, event.shiftKey ? -1 : 1);
					DropdownSelectNavigation.updateListSelection(listBox, currentIndex, nextIndex);
					break;
			}
		}
	}

	static updateListSelection(listBox, currentIndex, nextIndex) {
		const options = listBox.childNodes;
		DropdownSelectOption.deselectOption(options[currentIndex]);
		DropdownSelectOption.selectOption(options[nextIndex]);
		AriaHandler.setActiveDescendant(listBox, ElementHandler.getID(options[nextIndex]));
	}

	static getNextIndex(currentIndex, listSize, step = 1) {
		let nextIndex = currentIndex + step;
		return nextIndex > listSize ? 0 : (nextIndex < 0) ? listSize : nextIndex;
	}

}
