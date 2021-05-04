'use strict';
import './join-page.scss';
import { Page } from '../page';
import { MessageErrorType } from 'ONLINE_CONNECTION';
import { AddUsername } from '~/components/@components.module';
import { User } from '../../_models/user';
import { LocalStorageHelper } from 'UTILS';

export class JoinPage extends Page {
  #usernameForm;
  #user;
  #offlineConfirmation;
  #offlineConfirmationActions;

  constructor() {
    super();
    this.init();
    this.#offlineConfirmationActions = new Map();
    this.#offlineConfirmationActions.set('choiceA', this.#onRejectOfflineJoin.bind(this));
    this.#offlineConfirmationActions.set('choiceB', this.#onJoinOffline.bind(this));
    LocalStorageHelper.deleteUser();
  }

  renderPage(mainContainer) {
    this.#usernameForm = new AddUsername('join', this.#onJoin.bind(this));
    mainContainer.append(this.#usernameForm.render());
    //TODO: init from local storage
    this.#usernameForm.init('kate');
  }

  #onJoin(data) {
    const { username } = data;
    this.#user = new User(username);
    this.#usernameForm.setFormSubmittionState();
    this.onlineConnection.establishConnection(username)
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
    this.#usernameForm.hide();

    this.#displayOfflineConfirmation();
  }

  #onUsernameError() {
    this.#usernameForm.clearFormSubmittionState();
    this.#user = undefined;
    this.#usernameForm.setFormError('usernameInUse');
  }

  #displayOfflineConfirmation() {
    this.#offlineConfirmation = document.createElement('app-dilemma-selection');
    this.#offlineConfirmation.setAttribute('type', 'continue-offline');
    this.#offlineConfirmation.addEventListener('onChoiceSelected', (event) => {
      const selectedCoice = event.detail.value;
      this.#offlineConfirmationActions.get(selectedCoice)();
    });
    this.mainContainer.append(this.#offlineConfirmation);
  }

  #onRejectOfflineJoin() {
    this.#usernameForm.display();
    this.#offlineConfirmation.remove();
    this.#offlineConfirmation = undefined;
  }

  #onJoinOffline() {
    LocalStorageHelper.saveUser(this.#user);
    this.#offlineConfirmation = undefined;
    this.onChangePage();
  }
}
