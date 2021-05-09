export const DOM_ELEMENT_CLASS = {
  button: 'app-dropdown__toggle-button',
  panel: 'app-dropdown-panel'
};

export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}'>button</button>
<app-dropdown-panel id='%panelId%' name='%name%' expanded='%expanded%'></app-dropdown-panel>
`;

export const ARIA_LABEL = {
  settings: {
    'true': 'close app settings',
    'false': 'open app settings'
  }

};