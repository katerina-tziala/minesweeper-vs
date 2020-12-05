"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { GameType, GameVSMode } from "GameEnums";
import { LevelSettings, Player, BotPlayer } from "GameModels";



import { GameSinglePlayer } from "./game-type/game-single-player";
import { GameVS } from "./game-type/game-vs";




export class GameFactory {



  static getGame(gameParams, gameId) {
    gameParams.levelSettings = GameFactory.getLevelSettings(gameParams.levelSettings);

    const playersData = gameParams.players;
    delete gameParams.players;

    // console.log("GameFactory");
    // console.log(gameParams);

    //console.log(GameFactory.getBot(playersData));

    switch (gameParams.type) {
      case GameType.Original:
        return new GameSinglePlayer(gameId, gameParams, GameFactory.getPlayer());
      case GameType.Friend:
        return new GameVS(gameId, gameParams, GameFactory.getPlayer(), GameFactory.getOpponent(playersData));
      case GameType.Bot:
        return new GameVS(gameId, gameParams, GameFactory.getPlayer(), GameFactory.getBot(playersData));
      case GameType.Online:
        return new GameVS(gameId, gameParams, GameFactory.getPlayer(), GameFactory.getOpponent(playersData));
      default:
        return undefined;
    }
  }

  static getLevelSettings(settings) {
    const levelSettings = new LevelSettings();
    levelSettings.update(settings)
    return levelSettings;
  }

  static getPlayer() {
    const player = new Player(self.user.id, self.user.username);
    player.colorType = LocalStorageHelper.appSettings.playerColorType;
    return player;
  }

  static getOpponentData(players) {
    return players.find(player => player.id !== self.user.id);
  }

  static getOpponent(players) {
    const opponentData = this.getOpponentData(players);
    const opponent = new Player(opponentData.id, opponentData.username);
    opponent.colorType = LocalStorageHelper.appSettings.opponentColorType;
    return opponent;
  }

  static getBot(players) {
    const botPlayer = new BotPlayer();
    botPlayer.update(this.getOpponentData(players));
    botPlayer.colorType = LocalStorageHelper.appSettings.opponentColorType;
    return botPlayer;
  }
}