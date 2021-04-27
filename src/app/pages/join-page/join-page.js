'use strict';

import { Page } from '../page';

import { AddUsername } from '~/components/@components.module';

import OnlineConnection from '../../state-controllers/online-connection/online-connection';
import { User } from '../../_models/user';
import { MessageInType } from '../../state-controllers/online-connection/connection.message-in';
import { LocalStorageHelper } from 'UTILS';



export class JoinPage extends Page {
  #onlineConnection;
  #user;

  constructor() {
    super();
    this.#onlineConnection = OnlineConnection.getInstance();

  

    // this.#onlineConnection.onConnectionError = this.onConnectionError.bind(this);
    // this.#onlineConnection.onMessage = this.onMessage.bind(this);
    // this.#onlineConnection.onErrorMessage = this.onErrorMessage.bind(this);

    console.log('JoinPage');
    this.init();
  }

  renderPage(mainContainer) {
    this.joinUser = new AddUsername('join', this.#onJoin.bind(this));
    mainContainer.append(this.joinUser.render());

    //this.onConnectionError();
  }

  #onJoin(data) {
    // TODO:
    // console.log('disable from buttons show loader');
    this.#user = new User(data.username);
    this.#onlineConnection.establishConnection(data);
  }

  onConnectionError() {
    console.log("#onConnectionError joinpage");
    console.log("ask user for offline?");
    console.log(this.#user);
  }

  onMessage(message) {
    const { type, data } = message;
    if (type === MessageInType.Joined) {
      this.displayLoader();
      LocalStorageHelper.saveUser(data.user);
      LocalStorageHelper.savePeers(data.peers);
      this.onChangePage();
    }
  }

  onErrorMessage(data) {
    console.log("#onErrorMessage joinpage");
    this.hideLoader();
    console.log(data);
    console.log(this.#user);
    // console.log(data);
    //{type: "user-joined", data: {…}}
    // this.#onlineConnection.establishConnection(data);
  }


}
