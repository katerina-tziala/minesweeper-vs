"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./_game-parralel.constants";

export class GameParallelViewHelper {

  static generateGamingArea(games) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.gamingArea]);
    games.forEach(game => {
      container.append(GameParallelViewHelper.generateGameView(game));
    });
    return container;
  }

  static generateGameView(game) {
    const gameContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.gameContainer],
      GameParallelViewHelper.gameContainerID(game),
    );
    gameContainer.append(game.generateView());
    return gameContainer;
  }

  static gameContainerID(game) {
    return (
      DOM_ELEMENT_CLASS.gameContainer + TYPOGRAPHY.doubleUnderscore + game.id
    );
  }

  gameContainer(game) {
    return ElementHandler.getByID(GameParallelViewHelper.gameContainerID(game));
  }

  displayGameContainer(game) {
    return GameParallelViewHelper.gameContainer(game).then(gameContainer => {
      ElementHandler.display(gameContainer);
      return;
    });
  }

  hideGameContainer(game) {
    return GameParallelViewHelper.gameContainer(game).then(gameContainer => {
      ElementHandler.display(gameContainer);
      return;
    });
  }

}
