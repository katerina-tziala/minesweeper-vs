import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
import { LocalStorageHelper } from 'UTILS';


//will change to transform
// -- router guard
// on reload return to your state
import { PubSub, PubSubState } from 'UTILS';

import { generateMinesPositions } from './app/game/game-utils/game-utils';
import Minefield from './app/game/game-ui/minefield/Minefield';
import BoardFace from './app/game/game-ui/board-face/BoardFace';
import GameTimer from './app/game/game-ui/game-timer/GameTimer';
import './app/game/game-ui/flags-counter/FlagsCounter';

import AppUserService from './app/state-controllers/app-user.service';



//  const loadStyles = () => import("./index.scss");
var tiles = [];
document.addEventListener('DOMContentLoaded', () => {



  PageLoaderHandler.hide();
  //new App();

  const userService = AppUserService.getInstance();

  const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };
  // const minesPositions = generateMinesPositions(level.rows, level.columns, level.numberOfMines);
  ///const minesPositions = [9, 14, 15, 18, 22, 25, 27, 34, 49, 53, 58, 63, 64, 70, 71, 72];
  //console.log(minesPositions);
  const minesPositions = [1, 2, 3, 80, 81];
  //const minesCounter = document.getElementsByTagName('app-digital-counter')[0];

  const minefield = document.getElementsByTagName('app-minefield')[0];
  const boardFace = document.getElementById('board-face');
  const gameTimer = document.getElementsByTagName('app-game-timer')[0];


 // gameTimer.start();
  gameTimer.addEventListener('onTurnEnd', (event) => {
    console.log('onTurnEnd');
  });


  // 
  boardFace.addEventListener('onBoardFaceClick', (event) => {
    console.log('onBoardFaceClick');
  });

  setTimeout(() => {
    minefield.init(minesPositions);
    // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  }, 500);

  // setTimeout(() => {
  //   // const styles = userService.getPlayerConfig('dfgdfg');
  //   // boardFace.setAttribute('color', '#0000ff');
  //   // console.log(styles);
  //   // console.log('ddd');
  //   minesCounter.setAttribute('value', '-5');
  //   // const test = document.querySelectorAll('[theme="light"]');
  //   // console.log(test);
  //   // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  // }, 3000);


  // setTimeout(() => {
  //   minefield.setAttribute('theme', 'dark');
  //   minefield.setAttribute('mine-type', 'virusMine');
  //   // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  // }, 1500);
  minefield.addEventListener('onActiveTileChange', (event) => {
    const { activeTile } = event.detail;
    const face = activeTile ? 'surprise' : 'smile';
    boardFace.setAttribute('state', face);
  });


  minefield.addEventListener('onRevealTile', (event) => {
    const { tile } = event.detail;
    const styles = userService.getPlayerConfig('dfgdfg');
    if (tile.state !== 'flagged') {
      minefield.revealTile(tile, 'dfgdfg', styles)
    }


  });

  minefield.addEventListener('onChangeTileState', (event) => {
    const { tile } = event.detail;
    //console.log('onChangeTileState');
    const styles = userService.getPlayerConfig('dfgdfg');
    if (tile.state === 'untouched') {
      minefield.flagTile(tile, 'dfgdfg', styles);
    }
    else if (tile.state === 'flagged') {
      minefield.markTile(tile, 'dfgdfg', styles);
    }
    else if (tile.state === 'marked') {
      minefield.resetTile(tile, 'dfgdfg', styles);
    }

    // minefield.revealTiles(tile, 'dfgdfg')

  });




  //
  minefield.addEventListener('onFlaggedTile', (event) => {
    const { flaggedTile, allMinesDetected } = event.detail;
    console.log('onFlaggedTile');
    console.log(flaggedTile, allMinesDetected);
  });

  minefield.addEventListener('onDetonatedMine', (event) => {
    const { detonatedMine } = event.detail;
    console.log('onTilesUpdate');
    console.log(detonatedMine);
    minefield.revealMines();
    // minefield.revealTiles(tile, 'dfgdfg')
    boardFace.setAttribute('state', 'looser');
  });

  minefield.addEventListener('onRevealedTiles', (event) => {
    const { revealedTiles, minefieldCleared } = event.detail;
    console.log('onRevealedTiles');
    console.log(revealedTiles, minefieldCleared);
    if (minefieldCleared) {
      boardFace.setAttribute('state', 'winner');
    }
  });

  minefield.addEventListener('onMarkedTile', (event) => {
    const { markedTile } = event.detail;
    console.log('onMarkedTile');
    console.log(markedTile);

  });
  minefield.addEventListener('onResetedTile', (event) => {
    const { resetedTile } = event.detail;
    console.log('onResetedTile');
    console.log(resetedTile);

  });



  // console.log(minefield);
  // setTimeout(() => {
  //   minefield.setAttribute('disabled', true);
  //   console.log('disabled'); 
  // }, 3000);
  // setTimeout(() => {
  //   minefield.setAttribute('disabled', false);
  //   console.log('en'); 
  // }, 5000);

  // PageLoaderHandler.hide();


});
// window.onhashchange = this.locationHashChanged.bind(this);
// locationHashChanged(event) {
//   console.log(event);
//   if (location.hash === '#cool-feature') {
//     console.log("You're visiting a cool feature!");
//   }
// }




