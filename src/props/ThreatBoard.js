import { Container, Text, TextStyle, Graphics } from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../config.js';
import { normalizeThreatBoardData, THREAT_STATUS_COLORS } from './threatBoardModel.js';

const BOARD_WIDTH = 238;
const BOARD_HEIGHT = 340;
const PADDING = 10;
const ROW_HEIGHT = 28;

const TITLE_STYLE = new TextStyle({
  fill: 0xf5ecd7,
  fontFamily: 'monospace',
  fontSize: 9,
  align: 'center',
  wordWrap: true,
  wordWrapWidth: BOARD_WIDTH - PADDING * 2,
});

const LEVEL_LABEL_STYLE = new TextStyle({
  fill: 0xc9b896,
  fontFamily: 'monospace',
  fontSize: 8,
  align: 'left',
});

const LEVEL_VALUE_STYLE = new TextStyle({
  fill: 0xffee88,
  fontFamily: 'monospace',
  fontSize: 16,
  align: 'left',
});

const ENTRY_LABEL_STYLE = new TextStyle({
  fill: 0xd8ccb0,
  fontFamily: 'monospace',
  fontSize: 7,
  align: 'left',
});

const ENTRY_VALUE_STYLE = new TextStyle({
  fill: 0xffffff,
  fontFamily: 'monospace',
  fontSize: 7,
  align: 'right',
});

function createEntryRow(entry, y) {
  const row = new Container();
  row.y = y;

  const indicator = new Graphics();
  indicator.circle(6, ROW_HEIGHT / 2, 3).fill(THREAT_STATUS_COLORS[entry.status] ?? 0xffffff);

  const label = new Text({ text: entry.label, style: ENTRY_LABEL_STYLE });
  label.x = 16;
  label.y = 6;

  const value = new Text({ text: entry.value, style: ENTRY_VALUE_STYLE });
  value.anchor.set(1, 0);
  value.x = BOARD_WIDTH - PADDING - 4;
  value.y = 6;

  const divider = new Graphics();
  divider
    .moveTo(PADDING, ROW_HEIGHT - 1)
    .lineTo(BOARD_WIDTH - PADDING, ROW_HEIGHT - 1)
    .stroke({ color: 0x6b5a45, width: 1 });

  row.addChild(indicator, label, value, divider);
  return row;
}

export function createThreatBoard(initialData = null) {
  const root = new Container();
  root.visible = false;
  root.x = (CANVAS_WIDTH - BOARD_WIDTH) / 2;
  root.y = (CANVAS_HEIGHT - BOARD_HEIGHT) / 2;

  const background = new Graphics();
  background
    .roundRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT, 4)
    .fill(0x3d3228)
    .stroke({ color: 0x8b7355, width: 2 });

  const innerFrame = new Graphics();
  innerFrame
    .roundRect(PADDING / 2, PADDING / 2, BOARD_WIDTH - PADDING, BOARD_HEIGHT - PADDING, 2)
    .stroke({ color: 0x5c4a38, width: 1 });

  const title = new Text({ text: '', style: TITLE_STYLE });
  title.anchor.set(0.5, 0);
  title.x = BOARD_WIDTH / 2;
  title.y = PADDING + 2;

  const levelLabel = new Text({ text: 'CURRENT THREAT LEVEL:', style: LEVEL_LABEL_STYLE });
  levelLabel.x = PADDING + 2;
  levelLabel.y = 34;

  const levelValue = new Text({ text: '1', style: LEVEL_VALUE_STYLE });
  levelValue.x = PADDING + 2;
  levelValue.y = 46;

  const entriesContainer = new Container();
  entriesContainer.y = 78;

  root.addChild(background, innerFrame, title, levelLabel, levelValue, entriesContainer);

  function rebuildEntries(entries) {
    entriesContainer.removeChildren();

    entries.forEach((entry, index) => {
      entriesContainer.addChild(createEntryRow(entry, index * ROW_HEIGHT));
    });
  }

  function setData(data) {
    const normalized = normalizeThreatBoardData(data);
    title.text = normalized.title;
    levelValue.text = String(normalized.threatLevel);
    rebuildEntries(normalized.entries);
  }

  function show() {
    root.visible = true;
  }

  function hide() {
    root.visible = false;
  }

  function destroyThreatBoard() {
    root.destroy({ children: true });
  }

  if (initialData) {
    setData(initialData);
  }

  return {
    container: root,
    setData,
    show,
    hide,
    destroy: destroyThreatBoard,
  };
}
