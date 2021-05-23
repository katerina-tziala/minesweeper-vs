export const DOM_ELEMENT_CLASS = {
    container: 'stepper-container',
    steps: 'stepper-steps',
    progress: 'stepper--progress',
    filled: 'stepper-container--filled'
};

export const ATTRIBUTES = {
    name: 'name'
};

export const TEMPLATE = `<div class='${DOM_ELEMENT_CLASS.container}'>
<app-progress-bar class='${DOM_ELEMENT_CLASS.progress}'></app-progress-bar>
<app-stepper-list class='${DOM_ELEMENT_CLASS.steps}' aria-label='%ariaLabel%'></app-stepper-list>
</div>`;


export const ARIA_LABEL = {
    gameSettings: 'game settings'
};