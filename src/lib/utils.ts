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
    state: 0,
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

function isCellAlive(at: Cell): boolean {
  return at.state !== 0;
}

function countAliveNeighbors(matrix: Cell[][], at: Cell): number {
  let ret = 0;
  const isNeighbor = (hisCoord: number, myCoord: number) =>
    Math.abs(hisCoord - myCoord) === 1;

  matrix
    .filter((line: Cell[], y: number) => isNeighbor(y, at.row))
    .forEach((line: Cell[]) => {
      ret += line.filter(
        (cell: Cell, x: number) => isNeighbor(x, at.col) && isCellAlive(cell)
      ).length;
    });

  return ret;
}

function getNextCellState(matrix: Cell[][], at: Cell) {
  const ret: Cell = Object.assign({}, at);
  const lives: number = countAliveNeighbors(matrix, at);

  //  console.log("countAliveNeighbors", lives);

  if (isCellAlive(ret)) {
    ret.state = lives === 2 || lives === 3 ? 1 : 0;
  } else {
    ret.state = lives === 3 ? 1 : 0;
  }
  return ret;
}

/**
 * calculate new state of matrix depended of alive Cells' location
 * @param matrix
 * @returns
 */
function getNextGeneration(matrix: Cell[][]): Cell[][] {
  const ret: Cell[][] = Object.assign([{}], matrix);

  matrix.forEach((lines: Cell[], y: number) =>
    lines.forEach((cell: Cell, x: number) => {
      Object.assign(ret[y][x], getNextCellState(matrix, cell));
    })
  );
  return ret;
}

/**
 * Invert Cell state
 * @param {Cell} at cell to toggle state
 * @returns {Cell}  cell with new state
 */
function toggleCellState(at: Cell): Cell {
  const cell: Cell = Object.assign({}, at);
  cell.state = cell.state === 1 ? 0 : 1;

  return cell;
}

export { CellState, Cell, getMatrix, getNextGeneration, toggleCellState };
