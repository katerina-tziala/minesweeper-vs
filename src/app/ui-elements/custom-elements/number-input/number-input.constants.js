export const DOM_ELEMENT_CLASS = {
  minus: 'app-number-input__button--minus',
  plus: 'app-number-input__button--plus',
  input: 'app-number-input__input-field',
};

export const TEMPLATE = `
  <app-number-input-button class='${DOM_ELEMENT_CLASS.minus}'></app-number-input-button>
  <input class='${DOM_ELEMENT_CLASS.input}' id='input' type='text' value='' autocomplete='off'/>
  <app-number-input-button type='button' class='${DOM_ELEMENT_CLASS.plus}'></app-number-input-button>
`;

export const ATTRIBUTES = {
  disabled: 'disabled',
  value: 'value',
  name: 'name',
  min: 'min',
  max: 'max'
};
