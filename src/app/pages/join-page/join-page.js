'use strict';

import { Page } from '../page';

import { AddUsername } from '~/components/@components.module';


//
export class JoinPage extends Page {

  constructor() {
    super();


   // console.log('JoinPage');
    this.init();
  }

  renderPage(mainContainer) {
    console.log("render join page");
    this.joinUser = new AddUsername();
    mainContainer.append(this.joinUser.render());
  }
}
