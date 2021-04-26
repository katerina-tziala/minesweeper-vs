'use strict';
import { valueInRange } from 'UTILS';
const ValidationError = {
    Blank: 'blank',
    Spaces: 'spaces',
    Format: 'format',
    Length: 'length',
};
Object.freeze(ValidationError);

const USERNAME_LENGTH_RANGE = [3, 16];

export class UsernameValidation {

    static #usernameIncludesSpaces(username) {
        const usernameParts = username.split(' ');
        return usernameParts.length > 1;
    }

    static #usernameFormatValid(username) {
        return new RegExp(/([0-9_-]*[a-z][0-9_-]*){3}/igm).test(username);
    }

    static #validationErrorWhenDefined(username) {
        if (UsernameValidation.#usernameIncludesSpaces(username)) {
            return ValidationError.Spaces;
        }
        return UsernameValidation.#usernameFormatValid(username) ? undefined : ValidationError.Format;
    }

    static #validationErrorLength(username) {
        return UsernameValidation.validLength(username) ? undefined : ValidationError.Length;
    }

    static validationError(username) {
        if (!username) {
            return ValidationError.Blank;
        }
        return (
            UsernameValidation.#validationErrorWhenDefined(username) ||
            UsernameValidation.#validationErrorLength(username)
        );
    }

    static valid(username) {
        const validationError = UsernameValidation.validationError(username);
        return validationError ? false : true;
    }

    static validLength(username) {
        return username && valueInRange(username.length, USERNAME_LENGTH_RANGE);
    }

    static validMinLength(username) {
        return username && username.length >= USERNAME_LENGTH_RANGE[0];
    }
}
