'use strict';
import './lobby-page.scss';
import { Page } from '../page';

export class LobbyPage extends Page {


  constructor() {
    super();
    this.init();
  }

  renderPage(mainContainer) {
    console.log('LobbyPage');
    //mainContainer.append();
    console.log(mainContainer);
  }
  
}
