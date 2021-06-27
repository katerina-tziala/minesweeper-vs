export const DOM_ELEMENT_CLASS = {
  input: 'app-text-input__input',
  inputField: 'app-text-input__input-field',
  label: 'app-text-input__label',
  labelShake: 'app-text-input__label--shake',
  inputError: 'app-text-input__error-message'
};

export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.input}'>
  <div class='app-text-input__input-container'>
    <label class='${DOM_ELEMENT_CLASS.label}' for='input'></label>
    <input class='${DOM_ELEMENT_CLASS.inputField}' id='input' type='text' value='' autocomplete='off'/>
  </div>
</div>
<app-error-message class='${DOM_ELEMENT_CLASS.inputError}'></app-error-message>`;

export const ATTRIBUTES = {
  name: 'name',
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  errorMessage: 'error-message'
};

export const KEY_BLACKLIST = ['Shift', 'Alt', 'Control', 'Enter', 'Meta', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];