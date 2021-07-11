export const STATE_DEAD = 0;
export const STATE_ALIVE = 1;
export const STATE_RAISE = 2;
export const STATE_WEAK = 3;

export type CellState = 0 | 1 | 2 | 3;

/**
 * Create matrix with specified size
 * @param height
 * @param width
 * @returns
 */
export function getMatrix(height: number, width: number): CellState[][] {
  return new Array(height)
    .fill([])
    .map(() => new Array(width).fill(STATE_DEAD));
}

export function countAliveNeighbors(
  gameField: CellState[][],
  row: number,
  col: number
): number {
  let ret = 0;

  for (let y = row - 1; y <= row + 1; y += 1) {
    const range = gameField[y];
    if (range) {
      for (let x = col - 1; x <= col + 1; x += 1) {
        if (!(y === row && x === col) && range[x] === STATE_ALIVE) {
          ret += 1;
        }
      }
    }
  }
  return ret;
}

function getNextCellState(
  fieldState: CellState[][],
  row: number,
  col: number
): CellState {
  const lives: number = countAliveNeighbors(fieldState, row, col);

  if (fieldState[row][col]) {
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
export function getNextGeneration(fieldState: CellState[][]): CellState[][] {
  return fieldState.map((lines: CellState[], y: number) =>
    lines.map((cellState: CellState, x: number) =>
      getNextCellState(fieldState, y, x)
    )
  );
}

/**
 * Invert Cell state
 * @param {Cell} at cell to toggle state
 * @returns {CellState  cell with new state
 */
export function toggleCellState(cellState: CellState): CellState {
  return cellState === STATE_ALIVE || cellState === STATE_WEAK
    ? STATE_DEAD
    : STATE_ALIVE;
}

export function getSamrtState(
  cellState: CellState,
  nextState: CellState
): CellState {
  if (cellState == STATE_DEAD && nextState === STATE_ALIVE) {
    return STATE_RAISE;
  } else if (cellState == STATE_ALIVE && nextState === STATE_DEAD) {
    return STATE_WEAK;
  } else {
    return cellState;
  }
}
