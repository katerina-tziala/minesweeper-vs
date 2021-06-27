const MessageInType = {
  ErrorMessage: 'error',
  UserInfo: 'user-info',
  Joined: 'user-joined',
  Peers: 'peers-update',
  UserUpdated: 'user-updated',
  PrivateChat: 'private-chat',
  GameRoomOpened: 'game-room-opened',
  PlayerJoined: 'player-joined',
  PlayerLeft: 'player-left',
  PlayerUpdate: 'player-update',
  GameStart: 'game-start',
  GameExited: 'game-exited',
  GameState: 'game-state',
  GamePlayerInfo: 'game-player-info',
  GameChat: 'game-chat',
  GameUpdate: 'game-update',
  GameOver: 'game-over',
  PlayerTurnMove: 'player-turn-move',
  GameInvitation: 'game-invitation',
  GameInvitationAccepted: 'game-invitation-accepted',
  GameInvitationRejected: 'game-invitation-rejected',
  GameInvitationCanceled: 'game-invitation-canceled',
  GameRestartRequested: 'game-restart-requested',
  GameRestartCanceled: 'game-restart-canceled',
  GameRestartRejected: 'game-restart-rejected',
  GameRestartAccepted: 'game-restart-accepted',
  GameMovesCollection: 'game-moves-collection'
};
Object.freeze(MessageInType);

export { MessageInType };
