export const DOM_ELEMENT_CLASS = {
  button: 'app-dropdown__toggle-button',
  panel: 'app-dropdown__panel',
 // input: 'app-number-input__input-field',
};


export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}'>button</button>
<div class='${DOM_ELEMENT_CLASS.panel}'>
  <div class='app-dropdown__panel-content'>
    dropdown menu
  </div>
</div>`;
