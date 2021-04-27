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
  return new Array(width).map((item, col) => getNewCell(row, col));
}

function getMatrix(height: number, width: number): Cell[][] {
  return new Array(height).map((item, row) => getNewRow(row, width));
}

function isCellAlive(at: Cell): boolean {
  return at.state !== 0;
}

function countAliveNeighbors(matrix: Cell[][], at: Cell): number {
  let ret = 0;
  const isNeighbor = (hisCoord: number, myCoord: number) =>
    Math.abs(hisCoord - myCoord) < 2;

  matrix
    .filter((line: Cell[], y: number) => isNeighbor(y, at.row))
    .forEach((line: Cell[]) => {
      ret += line.filter(
        (cell: Cell, x: number) => isNeighbor(x, at.col) && isCellAlive(cell)
      ).length;
    });

  return ret;
}

function getNewCellState(matrix: Cell[][], at: Cell) {
  const ret: Cell = at;
  const lives: number = countAliveNeighbors(matrix, at);

  if (isCellAlive(at)) {
    ret.state = lives === 2 || lives === 3 ? 1 : 0;
  } else {
    ret.state = lives === 3 ? 1 : 0;
  }
  return ret;
}

function getNextGeneration(matrix: Cell[][]): Cell[][] {
  const ret: Cell[][] = matrix;

  matrix.forEach((lines: Cell[]) =>
    lines.forEach((cell: Cell) => {
      ret[cell.row][cell.col] = getNewCellState(matrix, cell);
    })
  );
  return ret;
}
/*
function numToCellStyate(num: number): CellState {

  return num === 0 ? 0 : 1;
}
*/
function toggleCellState(at: Cell): Cell {
  const cell: Cell = at;
  cell.state = at.state === 0 ? 1 : 0;
  return cell;
}

export { CellState, Cell, getMatrix, getNextGeneration, toggleCellState };
