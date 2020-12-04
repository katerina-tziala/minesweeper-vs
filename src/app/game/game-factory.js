"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { GameType, GameVSMode } from "GameEnums";
import { LevelSettings, Player } from "GameModels";



import { GameSinglePlayer } from "./game-type/game-single-player";




export class GameFactory {



  static getGame(gameParams, gameId) {
    gameParams.levelSettings = GameFactory.getLevelSettings(gameParams.levelSettings);

    const playersData = gameParams.players;
    delete gameParams.players;

    // console.log("GameFactory");
    // console.log(gameParams);

    switch (gameParams.type) {
      case GameType.Original:
        return new GameSinglePlayer(gameId, gameParams, GameFactory.getPlayer())
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


}