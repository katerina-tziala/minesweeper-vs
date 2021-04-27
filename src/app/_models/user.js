'use strict';
import { AppModel } from './app-model';

export class User extends AppModel {

  constructor(username, id) {
    super();
    this.username = username;
    this.id = id || username;
  }


  // conected() {
  //   return this.id !== this.username;
  // }

  // get inGame() {
  //   return valueDefined(this.gameRoomId);
  // }

  // removeInvitation(invitationId) {
  //   this.invitations = this.invitations.filter(invitation => invitation.id !== invitationId);
  // }

  // addInvitation(newInvitation) {
  //   this.invitations = this.invitations.filter(invitation => invitation.id !== newInvitation.id);
  //   this.invitations.push(newInvitation);
  // }

}
