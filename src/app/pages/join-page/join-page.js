'use strict';

import { Page } from '../page';

import { AddUsername } from '~/components/@components.module';

import OnlineConnection from '../../state-controllers/online-connection/online-connection';


//
export class JoinPage extends Page {
  #onlineConnection;

  constructor() {
    super();
    this.#onlineConnection = OnlineConnection.getInstance();
   
    // const connection = OnlineConnection.getInstance();
    // console.log(connection);
    // connection.add('test');
    // console.log(connection.get());
    // const connection2 = OnlineConnection.getInstance();
    // connection.add('test2');
    // console.log(connection2.get());


    // const connection = new OnlineConnection();
    // console.log(connection);
    // connection.add('test');
    // console.log(connection.get());
    // const connection2 =  new OnlineConnection();
    // connection.add('test2');
    // console.log(connection2.get());

    this.#onlineConnection.onConnectionError = this.#onConnectionError.bind(this);
    this.#onlineConnection.onMessage =  this.#onMessage.bind(this);;
    this.#onlineConnection.onErrorMessage =  this.#onErrorMessage.bind(this);

    console.log('JoinPage');
    this.init();
  }

  renderPage(mainContainer) {
    console.log("render join page");
    this.joinUser = new AddUsername('join', this.#onJoin.bind(this));
    mainContainer.append(this.joinUser.render());
  }


  #onJoin(data) {
    console.log("#onJoin");
    // console.log(data);
    //{type: "user-joined", data: {…}}
    this.#onlineConnection.establishConnection(data);
  }


  #onConnectionError() {
    console.log("#onConnectionError");
    // console.log(data);
    //{type: "user-joined", data: {…}}
    // this.#onlineConnection.establishConnection(data);
  }

  #onMessage(data) {
    console.log("#onMessage");
    console.log(data);
    //{type: "user-joined", data: {…}}
    // this.#onlineConnection.establishConnection(data);
  }

  #onErrorMessage() {
    console.log("#onErrorMessage");
    console.log(data);
    // console.log(data);
    //{type: "user-joined", data: {…}}
    // this.#onlineConnection.establishConnection(data);
  }


}
