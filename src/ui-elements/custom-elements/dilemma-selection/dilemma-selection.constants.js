export const TEMPLATE_REF_VALUE_ANGOR = `%`;

export const TEMPLATE = `<div class='dilemma-selection__content-container'>
<h2 class='dilemma-selection__title'>%title%</h2>
<p class='dilemma-selection__text'>%text%</p>
<div class='buttons-container'>
  <button class='button-text dilemma-selection__choiceA'>%choiceA%</button>
  <button class='button-text dilemma-selection__choiceB'>%choiceB%</button>
</div>
</div>`;

export const DOM_ELEMENT_CLASS = {
  content: 'dilemma-selection__content-container',
  shake: 'dilemma-selection__content-container--shake',
};

export const ATTRIBUTES = {
  type: 'type'
};

export const CONTENT = {
  'default': {
    title: 'Dilemma Selection',
    text: 'What is your choice?',
    choiceA: 'choice a?',
    choiceB: 'choice b?'
  },
  'continue-offline': {
    title: 'Connection could not be established!',
    text: 'Do you want to continue offline?',
    choiceA: 'no',
    choiceB: 'yes'
  }
};