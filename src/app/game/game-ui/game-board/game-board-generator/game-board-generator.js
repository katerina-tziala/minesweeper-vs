'use strict';
import { TemplateGenerator, ElementGenerator } from 'UI_ELEMENTS';
import { TEMPLATES, DOM_ELEMENT_CLASS } from './game-board-generator.constants';

export function generateTemplate(config) {
  const board = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.board]);
  const infoContainer = createBoardInfo(config);
  const minefield = TemplateGenerator.generate(TEMPLATES.minefield, config);
  board.append(infoContainer, minefield);
  return board;
}

function createBoardInfo(config) {
  const infoContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.boardInfo]);
  const boardInfo = config.gameTimer ? createBoardInfoWithGametimer(config) : createBoardInfoExcludingGameTimer(config);
  infoContainer.append(boardInfo);
  return infoContainer;
}

function createBoardInfoWithGametimer(config) {
  const fragment = document.createDocumentFragment();

  const gameTimer = TemplateGenerator.generate(TEMPLATES.gameTimer, config);
  const boardFace = TemplateGenerator.generate(TEMPLATES.boardFace);
  const flagsCounter = TemplateGenerator.generate(TEMPLATES.flagsCounter, config);

  fragment.append(gameTimer, boardFace, flagsCounter);
  return fragment;
}

function createBoardInfoExcludingGameTimer(config) {
  const fragment = document.createDocumentFragment();

  const boardFace = TemplateGenerator.generate(TEMPLATES.boardFace);
  const flagsCounter = TemplateGenerator.generate(TEMPLATES.flagsCounter, config);

  if (!config.flagsCounterRight) {
    fragment.append(flagsCounter, boardFace);
    return fragment;
  }

  fragment.append(boardFace, flagsCounter);
  return fragment;
}
