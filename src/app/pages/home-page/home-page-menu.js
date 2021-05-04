'use strict';
import { GameType } from 'GAME_ENUMS';
import { OnlineConnection } from 'ONLINE_CONNECTION';

export class HomePageMenu {
  #onlineConnection;

  constructor() {
    this.#onlineConnection = OnlineConnection.getInstance();
  }

  generateMenu(onMenuOptionSelected) {
    const menu = document.createElement('menu');
    Object.values(GameType).forEach(gameType => {
      menu.append(this.#generateMenuItem(gameType, onMenuOptionSelected));
    });
    return menu;
  }

  #generateMenuItem(type, onMenuOptionSelected) {
    const disabled = GameType.Online === type ? !this.#onlineConnection.live : false;
    const menuItem = document.createElement('app-menu-item');
    menuItem.setAttribute('type', type);
    menuItem.setAttribute('disabled', disabled);
    menuItem.addEventListener('selectedMenuItem', (event) => onMenuOptionSelected(event.detail.value));
    return menuItem;
  }

}
