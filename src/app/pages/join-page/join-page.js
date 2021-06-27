'use strict';
import './join-page.scss';
import { Page } from '../page';
import { MessageErrorType } from 'ONLINE_CONNECTION';
import { AddUsername } from '~/components/@components.module';

export class JoinPage extends Page {
  #usernameForm;
  #offlineConfirmation;
  #offlineConfirmationActions;

  constructor() {
    super();
    this.init();
    this.#offlineConfirmationActions = new Map();
    this.#offlineConfirmationActions.set('choiceA', this.#onRejectOfflineJoin.bind(this));
    this.#offlineConfirmationActions.set('choiceB', this.#onJoinOffline.bind(this));
  }

  renderPage(mainContainer) {
    this.#usernameForm = new AddUsername('join');
    this.#usernameForm.onSubmit = this.#onJoin.bind(this);
    mainContainer.append(this.#usernameForm.render());
    this.#usernameForm.init(this.appUserService.username);
  }

  #onJoin(data) {
    const { username } = data;
    this.appUserService.username = username;
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
    this.#offlineConfirmation = undefined;
    this.appUserService.joinedAt = new Date().toString();
    this.onChangePage();
  }
}
