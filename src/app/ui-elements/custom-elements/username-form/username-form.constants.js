export const DOM_ELEMENT_CLASS = {
  form: 'username-form__form',
  input: 'username-form__text-input',
  clearButton: 'username-form__button-clear',
  submitButton: 'username-form__button-submit'
};

export const TEMPLATE = `<form class='username-form__form'>
  <app-text-input class='username-form__text-input' name='username' leadingIcon='true'></app-text-input>
  <div class='username-form__buttons'>
    <button class='button-text username-form__button-clear'>clear</button>
    <button class='button-text username-form__button-submit'>%type%</button>
  </div>
</form>`;

export const ATTRIBUTES = {
  type: 'type'
};

export const ERROR_MESSAGE = {
  blank: 'Please enter a username!',
  spaces: 'Username cannot include spaces!',
  format: 'Username must have at least 3 letters!',
  length: 'Username must have at most 16 characters!',
  usernameInUse: 'Username is taken! Please enter a different username!',
};