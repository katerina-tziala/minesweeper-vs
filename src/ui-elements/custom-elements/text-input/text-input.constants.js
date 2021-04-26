export const DOM_ELEMENT_CLASS = {
  input: 'app-text-input__input',
  inputField: 'app-text-input__input-field',
  label: 'app-text-input__label',
  labelShake: 'app-text-input__label--shake',
  inputError: 'app-text-input__error-message'
};

export const TEMPLATE = `
<div class='app-text-input__input'>
  <div class='app-text-input__input-container'>
  <label class='${DOM_ELEMENT_CLASS.label}'></label>
  <input class='${DOM_ELEMENT_CLASS.inputField}' type='text' value='' autocomplete='off'/>
  </div>
</div>
<div class='${DOM_ELEMENT_CLASS.inputError}'></div>
`;

export const ATTRIBUTES = {
  name: 'name',
  value: 'value',
  errorMessage: 'error-message'
};

export const KEY_BLACKLIST = ['Shift', 'Alt', 'Control', 'Meta', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];