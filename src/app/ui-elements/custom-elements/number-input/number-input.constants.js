export const DOM_ELEMENT_CLASS = {
  minus: 'app-number-input__button--minus',
  plus: 'app-number-input__button--plus',
  input: 'app-number-input__input-field',
};

export const TEMPLATE = `
  <button type='button' class='${DOM_ELEMENT_CLASS.minus}'></button>
  <input class='${DOM_ELEMENT_CLASS.input}' id='input' type='text' value='' autocomplete='off'/>
  <button type='button' class='${DOM_ELEMENT_CLASS.plus}'></button>
`;

export const ATTRIBUTES = {
  disabled: 'disabled',
  value: 'value',
  name: 'name',
};

export const KEYS = {
  increaseKeys: ['ArrowUp', 'ArrowRight'],
  decreaseKeys: ['ArrowDown', 'ArrowLeft'],
  name: 'name',
};

