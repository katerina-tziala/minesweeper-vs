'use strict';

const ValidationError = {
    Blank: 'blank',
    Spaces: 'spaces',
    Format: 'format',
};
Object.freeze(ValidationError);


export class UsernameValidation {

    static #usernameIncludesSpaces(username) {
        const usernameParts = username.split(' ');
        return usernameParts.length > 1;
    }

    static #usernameFormatValid(username) {
        return new RegExp(/^(\w{4,})$/).test(username);
    }

    static #validationErrorWhenDefined(username) {
        if (UsernameValidation.#usernameIncludesSpaces(username)) {
            return ValidationError.Spaces;
        }
        return UsernameValidation.#usernameFormatValid(username) ? undefined : ValidationError.Format;
    }

    static validationError(username) {
        if (!username) {
            return ValidationError.Blank;
        }
        return UsernameValidation.#validationErrorWhenDefined(username);
    }

    static valid(username) {
        const validationError = UsernameValidation.validationError(username);
        return validationError ? false : true;
    }

    static validLength(username) {
        return username && username.length > 3 ? true : false;
    }
}
