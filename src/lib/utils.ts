const STATE_DEAD = 0;
const STATE_ALIVE = 1;

type CellState = 0 | 1;

type Cell = {
  row: number;
  col: number;
  state: CellState;
};

function getNewCell(y: number, x: number): Cell {
  return {
    row: y,
    col: x,
    state: STATE_DEAD,
  };
}

function getNewRow(row: number, width: number): Cell[] {
  return new Array(width).fill({}).map((item, col) => getNewCell(row, col));
}

/**
 *
 * @param height Create matrix with specified size
 * @param width
 * @returns
 */
function getMatrix(height: number, width: number): Cell[][] {
  return new Array(height).fill([]).map((item, row) => getNewRow(row, width));
}

function isCellAlive(cell: Cell | undefined): boolean {
  if (cell) {
    return cell.state === STATE_ALIVE;
  }
  return false;
}

function countAliveNeighbors(gameField: Cell[][], atCell: Cell): number {
  let ret = 0;

  for (let y: number = atCell.row - 1; y <= atCell.row + 1; y += 1) {
    const range: Cell[] | undefined = gameField[y];
    if (range) {
      for (let x: number = atCell.col - 1; x <= atCell.col + 1; x += 1) {
        const cell: Cell | undefined = range[x];
        if (isCellAlive(cell) && cell !== atCell) {
          ret += 1;
        }
      }
    }
  }
  return ret;
}

function getNextCellState(gameField: Cell[][], atCell: Cell): CellState {
  const lives: number = countAliveNeighbors(gameField, atCell);
  if (isCellAlive(atCell)) {
    return lives === 2 || lives === 3 ? STATE_ALIVE : STATE_DEAD;
  } else {
    return lives === 3 ? STATE_ALIVE : STATE_DEAD;
  }
}

/**
 * calculate new state of matrix depended of alive Cells' location
 * @param matrix
 * @returns
 */
function getNextGeneration(gameFiled: Cell[][]): Cell[][] {
  return gameFiled.map((lines: Cell[], y: number) =>
    lines.map((cell: Cell, x: number) => {
      const ret: Cell = Object.assign({}, cell);
      ret.state = getNextCellState(gameFiled, cell);
      return ret;
    })
  );
}

/**
 * Invert Cell state
 * @param {Cell} at cell to toggle state
 * @returns {CellState  cell with new state
 */
function toggleCellState(cell: Cell): CellState {
  return cell.state === STATE_DEAD ? STATE_ALIVE : STATE_DEAD;
}

export {
  CellState,
  Cell,
  STATE_DEAD,
  STATE_ALIVE,
  getMatrix,
  toggleCellState,
  countAliveNeighbors,
  getNextGeneration,
};
