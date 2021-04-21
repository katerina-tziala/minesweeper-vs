'use strict';

import { CONNECTION_CONFIG } from './connection-config.constants';

export class OnlineConnection {
  // #actions;
  // #webSocket;
  // // #peers = [];
  // // #invitations = [];
  // #messageReceivedHandler;

  constructor() {
    console.log("OnlineConnection");
    // this.#messageReceivedHandler = messageReceivedHandler;
    // this.#messageReceivedHandler = {
    //   'user-joined': this.#onUserJoined.bind(this),
    //   'user-update': this.#onUserUpdate.bind(this),
    //   'peers-update': this.#onPeersUpdate.bind(this),
    //   'game-room-opened': this.#onRoomOpened.bind(this),
    //   'game-invitation': this.#onInvitationReceived.bind(this),
    // };
    // this.actions = actions;
    // console.log(TESTGAME);
    //  this.setTestPeers();
    // this.#invitations = INVITATIONSTEST;
    //this.#invitations = [];
  }

  // setTestPeers() {
  //   const peers = [];
  //   peers.push(new User('kate1', 'kate', 'asdf'));
  //   for (let index = 0; index < 10; index++) {
  //     const stringNumber = index.toString();
  //     const roomId = index % 2 === 0 ? 'room' + stringNumber : undefined;
  //     let name = 'kate' + stringNumber;
  //     for (let i = 0; i < index; i++) {
  //       name += 'kate';
  //     }
  //     peers.push(new User(stringNumber, name, roomId));
  //   }

  //   this.peers = peers;
  // }


  // set actions(actions) {
  //   this.#actions = actions;
  // }

  // get actions() {
  //   return this.#actions;
  // }

  // get live() {
  //   //return true;
  //   return valueDefined(this.#webSocket);
  // }

  // establishConnection(username) {
  //   this.#webSocket = new WebSocket(
  //     CONNECTION_CONFIG.url,
  //     CONNECTION_CONFIG.protocols,
  //   );
  //   this.#webSocket.addEventListener('error', (event) => this.#onError(event));
  //   this.#webSocket.addEventListener('open', () => {
  //     this.#webSocket.addEventListener('message', (event) => this.#onMessageReceived(JSON.parse(event.data)));
  //     this.#webSocket.addEventListener('close', (event) => this.#onClose(event));
  //     this.sendData('join', { username });
  //   });
  // }

  // #onError(event) {
  //   this.#webSocket = undefined;
  //   console.log('#onError', event);
  //   self.toastNotifications.show(NOTIFICATION_MESSAGE.connectionError);
  //   this.#submitError();
  // }

  // #submitError(errorType = 'connection-error') {
  //   if (this.onError) {
  //     this.onError(errorType);
  //   }
  //   if (errorType === 'username-in-use') {
  //     const message = self.user ? NOTIFICATION_MESSAGE.usernameInUseReconnect : NOTIFICATION_MESSAGE.usernameInUse;
  //     self.toastNotifications.show(message);
  //   }
  // }

  // #onClose(event) {
  //   console.log('#onClose');
  //   console.log(event);
  // }

  // #onMessageReceived(message) {
  //   if (!this.#messageReceivedHandler || !message || !message.type) {
  //     return;
  //   }

  //   if (message.type === 'error') {
  //     this.#submitError(message.data.errorType);
  //     return;
  //   }

  //   if (this.#messageReceivedHandler[message.type]) {
  //     this.#messageReceivedHandler[message.type](message.data);
  //   } else {
  //     console.log('not configured message');
  //     console.log('onConnectionMessage');
  //     console.log(message);
  //   }
  // }

  // // #onUserUpdate(data) {
  // //   AppUserHandler.updateUser(data);

  // //   if (this.onUserUpdate) {
  // //     this.onUserUpdate();
  // //   }

  // //   this.#onPeersUpdate(data);
  // // }

  // // #onPeersUpdate(data) {
  // //   if (!data.peers) {
  // //     return;
  // //   }
  // //   AppUserHandler.updateUserPeers(data.peers);

  // //   if (this.onPeersUpdate) {
  // //     this.onPeersUpdate();
  // //   }
  // // }

  // // #onUserJoined(data) {
  // //   AppUserHandler.updateUser(data);
  // //   AppUserHandler.updateUserPeers(data.peers);

  // //   if (this.onUserJoined) {
  // //     this.onUserJoined();
  // //   }
  // // }

  // // #onRoomOpened(data) {
  // //   AppUserHandler.updateUser(data);
  // //   if (this.onRoomOpened) {
  // //     const gameParams = data.game;
  // //     this.onRoomOpened(gameParams);
  // //   }
  // // }

  // // #onInvitationReceived(invitation) {
  // //   self.user.addInvitation(invitation);

  // //   if (this.onInvitationReceived) {
  // //     this.onInvitationReceived(invitation);
  // //   }
  // // }

  // sendData(type, data) {
  //   if (!this.live) {
  //     console.log('no this.webSocket');
  //     return;
  //   }
  //   const message = { type, data };
  //   this.#webSocket.send(JSON.stringify(message));
  // }

  // sendInvitation(gameParams) {
  //   //console.log(gameParams);
  //   const playersExpected = [gameParams.players[1].id];
  //   // const gameProperties = gameParams;
  //   const { players,  ...settings} = gameParams;
 
  //   const data = {
  //     settings,
  //     playersExpected,
  //     settings: settings,
  //     //allowedPlayers: 2,
  //     startWaitingTime: 8000
  //   };

  //   console.log(data);
  
  //   this.sendData('open-private-game-room', data);
  // }

  // sendInvitationResponse(type, id) {
  //   self.user.removeInvitation(id);
  //   this.sendData(type, { id });
  // }

  // disconnect() {
  //   if (self.user) {
  //     this.sendData('disconnect');
  //   }
  // }

  // quitGame(gameId) {
  //   if (self.user) {
  //     this.sendData('quit-game', {'id': gameId});
  //   }
  // }

}
