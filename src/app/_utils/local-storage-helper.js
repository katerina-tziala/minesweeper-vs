"use strict";

export class LocalStorageHelper {

	static save(keyName, value) {
		localStorage.setItem(keyName, JSON.stringify(value));
	}

	static retrieve(keyName) {
		const item = localStorage.getItem(keyName);
		return item ? JSON.parse(item) : undefined;
	}

	static remove(keyName) {
		return localStorage.removeItem(keyName);
	}

	static clear() {
		return localStorage.clear();
	}

}

