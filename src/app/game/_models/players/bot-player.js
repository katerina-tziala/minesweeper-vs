"use strict";

import { Player } from "./player";
import { BotMode } from "GameEnums";
export class BotPlayer extends Player {
  constructor() {
    super("minesweeperBot", "Minesweeper-Bot");
    this.mode = BotMode.Easy;
    this.isBot = true;
  }
}
