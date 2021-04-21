'use strict';
import { AppLoaderHandler } from './app-loader.handler';
export class App {

  constructor() {
    console.log('App');
  
    AppLoaderHandler.hide();
  }

}
