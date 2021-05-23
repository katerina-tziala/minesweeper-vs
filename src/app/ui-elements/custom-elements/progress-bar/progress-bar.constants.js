export const DOM_ELEMENT_CLASS = {
    track: 'progress-bar__track',
    progressIndicator: 'progress-bar__progress-indicator'
};

export const ATTRIBUTES = {
    progress: 'progress'
};

export const TEMPLATE = `
<div class='${DOM_ELEMENT_CLASS.track}'>
    <div class='${DOM_ELEMENT_CLASS.progressIndicator}'></div>
</div>`;
