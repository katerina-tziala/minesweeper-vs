'use strict';
import { AppLoaderHandler } from './app-loader-handler';
import { JoinPage } from './pages/join-page/join-page';
export class App {

  constructor() {
    //console.log('App');
  
    AppLoaderHandler.hide();
    new JoinPage();
  }

}
