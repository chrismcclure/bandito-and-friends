import { Container } from 'pixi.js';
import { createThreatBoard } from '../props/ThreatBoard.js';
import { EPISODE_01_PEACEFUL_THREAT_BOARD } from '../data/episode-01-threat-board.js';

export function createThreatBoardPreviewScene(data = EPISODE_01_PEACEFUL_THREAT_BOARD) {
  const container = new Container();
  const board = createThreatBoard(data);

  board.show();
  container.addChild(board.container);

  function update() {}

  function destroy() {
    board.destroy();
  }

  return { container, update, destroy };
}
