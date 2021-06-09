'use strict';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { CONFIG } from './minefield-tile/tile.constants';
import * as TileChecker from './minefield-tile/tile-checker';
import * as GameColors from '../game-utils/game-colors';
import * as TileUI from './minefield-tile/tile-ui';
import { CavnasUtils, Color } from 'UTILS';
import { TileState } from './minefield-tile/tile-state.enum';

export function setCanvasHeight(canvas, rows = 0, columns = 0) {
    if (canvas) {
        const width = (rows * CONFIG.tileSize) + (rows + 1);
        const height = (columns * CONFIG.tileSize) + (columns + 1);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
    }
}

export function drawTile(ctx, tile, theme = 'light') {
    if (!ctx) {
        return;
    }
    TileUI.drawTileShape(ctx, tile);
    TileUI.drawTileBackground(ctx, tile, theme);
    TileUI.drawTileShadow(ctx, tile, theme);
}


export function drawRevealedTile(ctx, tile, theme = 'light') {
    if (!ctx) {
        return;
    }
    TileUI.drawTileShape(ctx, tile);
    TileUI.drawTileBackground(ctx, tile, theme);


    const containsMine = TileChecker.containsMine(tile);
    if (containsMine) {
        console.log('mine!');
        return;
    }

    const minesPositions = [9, 14, 15, 18, 22, 25, 27, 34, 49, 53, 58, 63, 64, 70, 71, 72];
    const minesAround = TileChecker.getNumberOfMinesAround(tile.neighbors, minesPositions);
   
    const content = minesAround ? minesAround.toString() : undefined;
    TileUI.drawTileContent(ctx, tile.area, content, theme)
    // // const minesAround = TileChecker.getNumberOfMinesAround(tile.neighbors, minesPositions);
    // if (!minesAround) {
    //     return;
    // }
    // // // console.log(tile.neighbors);
    // // // console.log(minesAround);
    // // ctx.fillStyle = "red";
    // ctx.font = "16px Nunito";
    
    // const color = GameColors.getThemeColor(theme, content);

    // ctx.fillStyle = LightenDarkenColor(color, 50);
    // ctx.strokeStyle = color;

    // console.log(LightenDarkenColor(color, -50));
    // console.log(Color.adjustHexColorBrightness(color, -50));


    // ctx.fillText(content, tile.area.xStart + 8, tile.area.yStart + 20);

    // ctx.lineWidth = 1;
    // ctx.strokeText(content, tile.area.xStart + 8, tile.area.yStart + 20);
}





// function checkRGBValue(value) {
//     if (value > 255) {
//         return 255;
//     }
//     return value < 0 ? 0 : value
// }






// function LightenDarkenColor(colorCode, adjustmentAmount) {
//     const colorNumber = parseInt(colorCode.slice(1), 16);


//     var r = (colorNumber >> 16) + adjustmentAmount;
//     r = checkRGBValue(r);

//     console.log(colorNumber);
//     console.log(colorNumber >> 16);



//     var b = ((colorNumber >> 8) & 0x00FF) + adjustmentAmount;
//     b = checkRGBValue(b);


//     var g = (colorNumber & 0x0000FF) + adjustmentAmount;
//     g = checkRGBValue(g);


//     return "#" + (g | (b << 8) | (r << 16)).toString(16);
// }






