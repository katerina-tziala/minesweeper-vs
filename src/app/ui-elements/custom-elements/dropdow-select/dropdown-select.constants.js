export const DOM_ELEMENT_CLASS = {
  button: 'app-dropdown-select__toggle-button',
  buttonIcon: 'app-dropdown-select__toggle-button-icon',
  buttonText: 'app-dropdown-select__toggle-button-text',
  list: 'app-dropdown-select__select-list',
};

export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}' aria-haspopup='listbox' aria-label='%buttonText%'>
  <span class='${DOM_ELEMENT_CLASS.buttonText}'>%buttonText%</span>
  <span class='${DOM_ELEMENT_CLASS.buttonIcon}'></span>
</button>
<app-dropdown-panel id='%panelId%' name='%name%' expanded='%expanded%'>
  <app-dropdown-select-list class='${DOM_ELEMENT_CLASS.list}'></app-dropdown-select-list>
</app-dropdown-panel>
`;



export const ARIA_LABEL = {
  default: 'choose an option for ',
  level: 'choose game level'
};