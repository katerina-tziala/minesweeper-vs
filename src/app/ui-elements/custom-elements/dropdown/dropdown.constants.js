export const DOM_ELEMENT_CLASS = {
  content: 'app-dropdown__content',
  button: 'app-dropdown__toggle-button',
  panel: 'app-dropdown__panel'
};


export const ATTRIBUTES = {
  disabled: 'disabled'
};

export const TEMPLATE = `
<button class='${DOM_ELEMENT_CLASS.button}'>button</button>
<div class='${DOM_ELEMENT_CLASS.panel}'>
    <div>
      <div>item i</div>
      <div>item ii</div>
    </div>
</div>
`;
