'use strict';
import { Page } from '../page';
import { OnlineConnection, MessageErrorType } from 'ONLINE_CONNECTION';
import { AddUsername } from '~/components/@components.module';
import { User } from '../../_models/user';

export class JoinPage extends Page {
  #onlineConnection;
  #usernameForm;
  #user;

  constructor() {
    super();
    this.#onlineConnection = OnlineConnection.getInstance();
    this.init();
  }

  renderPage(mainContainer) {
    this.#usernameForm = new AddUsername('join', this.#onJoin.bind(this));
    mainContainer.append(this.#usernameForm.render());
  }

  #onJoin(data) {
    const { username } = data;
    this.#user = new User(username);
    this.#usernameForm.setFormSubmittionState();
    this.#onlineConnection.establishConnection(username)
      .then(() => this.onChangePage())
      .catch(error => this.#onConnectionFailed(error));
  }


  #onConnectionFailed(errorType) {
    if (errorType && errorType === MessageErrorType.UsernameInUse) {
      this.#onUsernameError();
    } else {
      this.#checkOfflineJoin();
    }
  }

  #checkOfflineJoin() {
    this.#usernameForm.clearFormSubmittionState();
    console.log("ask user for offline?");
    console.log(this.#user);
  }

  #onUsernameError() {
    this.#usernameForm.clearFormSubmittionState();
    this.#user = undefined;
    this.#usernameForm.setFormError('usernameInUse');
  }

}
