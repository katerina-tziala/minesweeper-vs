'use strict';

export const DOM_ELEMENT_CLASS = {
  button: 'link-invitation-button',
  buttonIcon: 'link-invitation-button-icon',
  buttonText: 'link-invitation-button-text'
};

export const CONTENT = {
  title: "Invite a friend",
  text: "Start a game and send a link to your friend to join",
};
export const CONTENT_TEMPLATE = `
<div class='menu-item__icon'></div>
<div class='menu-item__content'>
<h2>%title%</h2>
<div class='menu-item__details'><p>%text%</p></div>
</div>`;
