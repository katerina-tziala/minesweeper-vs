export const DOM_ELEMENT_CLASS = {
  button: 'app-dropdown-select__toggle-button',
  buttonIcon: 'app-dropdown-select__toggle-button-icon',
  buttonText: 'app-dropdown-select__toggle-button-text'
};

export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}'>
  <span class='${DOM_ELEMENT_CLASS.buttonText}'>select ###</span>
  <span class='${DOM_ELEMENT_CLASS.buttonIcon}'></span>
</button>
<app-dropdown-panel name='%name%' expanded='%expanded%'></app-dropdown-panel>
`;

export const ARIA_LABEL = {
  settings: {
    'true': 'close app settings',
    'false': 'open app settings'
  }

};