export const DOM_ELEMENT_CLASS = {
    container: 'wizard-stepper-container',
    track: 'wizard-stepper-track'
};

export const ATTRIBUTES = {

};

export const TEMPLATES = {
    container: `<div class='${DOM_ELEMENT_CLASS.container}'></div>`,
    track: `<div class='${DOM_ELEMENT_CLASS.track}'></div>`,
    step: `<app-wizard-stepper-step name='%name%' ariaLabel = '%ariaLabel%'
    disabled='%disabled%' selected='%selected%' visited='%visited%'></app-wizard-stepper-step>`
};
