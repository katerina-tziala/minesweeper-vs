// import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
// import { LocalStorageHelper } from 'UTILS';

import './app/ui-elements/custom-elements/loader/Loader';

//will change to transform
// -- router guard
// on reload return to your state

import AppUserService from './app/state-controllers/app-user.service';


//import './app/game/game-ui/game-board/game-board-vs/GameBoardVS';
import './app/game/game-ui/game-board/game-board-original/GameBoardOriginal';

import './app/game/game-ui/game-board/game-board-vs/game-board-detect/GameBoardDetect';

import './app/game/game-ui/game-board/game-board-vs/game-board-clear/GameBoardClear';
//  const loadStyles = () => import("./index.scss");

document.addEventListener('DOMContentLoaded', () => {



  PageLoaderHandler.hide();
  //
  // new App();
  const userService = AppUserService.getInstance();

  const player = { id: userService.id, name: userService.username };
  const playerStyles = userService.getPlayerConfig(player.id);
  player.styles = playerStyles;
  const opponent = { id: 'opponent', name: 'Angie' };
  const opponentStyles = userService.getPlayerConfig(opponent.id);
  opponent.styles = opponentStyles;

  const gameStyles = userService.gameStyles;
  gameStyles.flagTypes = playerStyles.flagType + ',' + opponentStyles.flagType;
  gameStyles.flagColors = `${playerStyles.colorType},${opponentStyles.colorType}`;


  // console.log(player);
  // console.log(playerStyles);
  // console.log(gameStyles);
  const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };
  const { rows, columns, numberOfMines } = { level };

  const options = {
    marks: true,
    misplacedFlagHint: false,
    revealing: true,
    unlimitedFlags: true,
    turnDuration: 5,
    gameTimer: true,
    flagsCounterRight:false
  };

  // const options = {
  //   flagging: true,
  //   marks: true,
  //   misplacedFlagHint: false,
  //   openStrategy: true,
  //   sneakPeek: false,
  //   sneakPeekDuration: 0,
  //   unlimitedFlags: true
  // }
  const turns = {
    consecutiveTurns: true,
    missedTurnsLimit: 10,
    turnDuration: 5,
    turnTimer: true
  }
  const config = { level, options, turns, gameStyles };
  const board = document.getElementById('board');
  //console.log(board);
  board.init(config);
  board.start(player, [1, 2, 3, 80, 81])




});
// window.onhashchange = this.locationHashChanged.bind(this);
// locationHashChanged(event) {
//   console.log(event);
//   if (location.hash === '#cool-feature') {
//     console.log("You're visiting a cool feature!");
//   }
// }




