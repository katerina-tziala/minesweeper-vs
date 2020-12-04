"use strict";

import { Player } from "./player";
import { BotMode } from "../../_enums/bot-mode.enum";
export class BotPlayer extends Player {

  constructor() {
    super("minesweeperBot", "Minesweeper-Bot");
    this.mode = BotMode.Easy;
    this.isBot = true;
  }

}