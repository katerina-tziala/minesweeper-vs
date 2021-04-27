'use strict';
import { Page } from '../page';
import { LocalStorageHelper } from 'UTILS';
import OnlineConnection from '../../state-controllers/online-connection/online-connection';
import { MessageInType } from '../../state-controllers/online-connection/connection.message-in';
import { User } from '../../_models/user';
import { AddUsername } from '~/components/@components.module';

export class JoinPage extends Page {
  #onlineConnection;
  #user;

  constructor() {
    super();
    this.#onlineConnection = OnlineConnection.getInstance();
    this.init();
  }

  renderPage(mainContainer) {
    this.joinUser = new AddUsername('join', this.#onJoin.bind(this));
    mainContainer.append(this.joinUser.render());

    this.onErrorMessage();
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
    // this.hideLoader();
    // console.log(data);
    const errorData = {
      type: "error",
      errorType: "username-in-use"
    };
    
    console.log(errorData);
    //console.log(this.#user);
    // console.log(data);
    //{type: "user-joined", data: {…}}
    // this.#onlineConnection.establishConnection(data);
  }


}
