export const ATTRIBUTES = {
  type: 'type',
  disabled: 'disabled'
};

export const TEMPLATE = `
<div class='menu-item__icon'></div>
<div class='menu-item__content'>
  <h2>%title%</h2>
  <div class='menu-item__details'><p>%text%</p></div>
</div>`;

export const MENU_ITEM = {
  online: {
    title: "VS Online",
    text: "Play online against connected users or invite a friend",
  },
  bot: {
    title: "VS Bot",
    text: "Play offline against the bot",
  },
  friend: {
    title: "VS Friend",
    text: "Play against a friend sharing the same device",
  },
  original: {
    title: "Original",
    text: "Play the original game",
  }
};
