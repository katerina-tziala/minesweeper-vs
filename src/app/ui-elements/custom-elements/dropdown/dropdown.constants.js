export const DOM_ELEMENT_CLASS = {
  button: 'app-dropdown__toggle-button',
  panel: 'app-dropdown-panel',
  panelWrapper: 'app-dropdown__panel-wrapper',
  
};


export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}'>button</button>
<app-dropdown-panel name='%name%' expanded='%expanded%'></app-dropdown-panel>
`;
