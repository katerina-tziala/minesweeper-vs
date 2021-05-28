'use strict';
import './game-page.scss';
import { Page } from '../page';

export class GamePage extends Page {


  constructor(gameConfig) {
    super();
    console.log(gameConfig);
    this.init();
  }

  renderPage(mainContainer) {
    console.log('GamePage');
    //mainContainer.append();
    console.log(mainContainer);
  }
  
}
