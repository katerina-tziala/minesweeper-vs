export const DOM_ELEMENT_CLASS = {
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    timeSeparator: 'time-separator'
};

export const ATTRIBUTES = {

};

export const TEMPLATE = `
    <app-digital-counter class='${DOM_ELEMENT_CLASS.hours}' min='0' max='23' value='0'></app-digital-counter>
    <div class='${DOM_ELEMENT_CLASS.timeSeparator}'></div>
    <app-digital-counter class='${DOM_ELEMENT_CLASS.minutes}' min='0' max='59' value='0'></app-digital-counter>
    <div class='${DOM_ELEMENT_CLASS.timeSeparator}'></div>
    <app-digital-counter class='${DOM_ELEMENT_CLASS.seconds}' min='0' max='59' value='0'></app-digital-counter>
`;
