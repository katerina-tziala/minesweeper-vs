import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
import { LocalStorageHelper } from 'UTILS';
// import './styles/iconography/fontawesome/fontawesome.scss';
// import './styles/iconography/fontawesome/regular.scss';
// import './styles/iconography/fontawesome/solid.scss';

//will change to transform
// -- router guard
// on reload return to your state
import { PubSub, PubSubState } from 'UTILS';



import { generateMinesPositions } from './app/game/game-utils/game-utils';
import Minefield from './app/game/minefield/Minefield';


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
  
  const minefield = document.getElementsByTagName('app-minefield')[0];

  setTimeout(() => {
    minefield.init(minesPositions);
    // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  }, 500);

  setTimeout(() => {
    minefield.setAttribute('theme', 'dark');
    minefield.setAttribute('mine-type', 'virusMine');
    // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  }, 1500);

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

  // minefield.addEventListener('onTilesUpdate', (event) => {
  //   const { updatedTiles } = event.detail;
  //   console.log('onTilesUpdate');
  //   console.log(updatedTiles);

  //   // minefield.revealTiles(tile, 'dfgdfg')

  // });

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

  });
  minefield.addEventListener('onRevealedTiles', (event) => {
    const { revealedTiles, minefieldCleared } = event.detail;
    console.log('onRevealedTiles');
    console.log(revealedTiles, minefieldCleared);

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


  // minefield.addEventListener('onActiveTileChange', (event) => {
  //   const { activeTile} = event.detail;
  //   console.log('onActiveTileChange');
  //   console.log(activeTile);
  // });

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




