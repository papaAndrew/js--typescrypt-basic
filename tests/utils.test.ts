import {
  CellState,
  STATE_ALIVE,
  STATE_DEAD,
  getMatrix,
  toggleCellState,
  countAliveNeighbors,
  getNextGeneration,
  STATE_WEAK,
  STATE_RAISE,
} from "../src/model/utils";

function numsToCellState(mx: number[][]): CellState[][] {
  return mx.map((line) => line.map((item) => item as CellState));
}

function numsToStr(mx: number[][]): string {
  return `\n${mx
    .map((line) => line.map((item) => item).join(" "))
    .join("\n")}\n`;
}

describe("Test utilities", () => {
  describe("Function getMatrix creates matrix with specified size", () => {
    [
      [10, 0],
      [1, 100],
      [3, 1],
    ].forEach(([height, width]) => {
      const matrix = getMatrix(height, width);

      it(`this matrix contains ${height} rows`, () => {
        expect(matrix.length).toBe(height);
      });

      describe(`getMatrix create two-dim array with ${height} rows and ${width} columns`, () => {
        matrix.forEach((line) => {
          it(`length of this row is ${width} Cells`, () => {
            expect(line.length).toBe(width);
          });
        });
      });
    });
  });

  describe("tesing countAliveNeighbors", () => {
    [
      { fieldState: [[0, 1]], neighbors: [[1, 0]] },
      {
        fieldState: [
          [0, 1],
          [0, 1],
        ],
        neighbors: [
          [2, 1],
          [2, 1],
        ],
      },
      {
        fieldState: [
          [0, 0, 1, 0],
          [0, 0, 0, 1],
          [0, 1, 1, 1],
        ],
        neighbors: [
          [0, 1, 1, 2],
          [1, 3, 5, 3],
          [1, 1, 3, 2],
        ],
      },
    ].forEach((suite) => {
      describe(`for field ${numsToStr(
        suite.fieldState
      )} neighbors number is ${numsToStr(suite.neighbors)}`, () => {
        const fieldState: CellState[][] = numsToCellState(suite.fieldState);

        for (let y = 0; y < fieldState.length; y++) {
          const range: CellState[] = fieldState[y];
          for (let x = 0; x < range.length; x++) {
            const expectedValue = suite.neighbors[y][x];
            it(`cell[${y}:${x}] have ${expectedValue} neighbours`, () => {
              expect(countAliveNeighbors(fieldState, y, x)).toBe(expectedValue);
            });
          }
        }
      });
    });
  });

  describe("Function getNextGeneration calculate new state of matrix depended of combinations", () => {
    [
      { prevState: [[1]], nextState: [[0]] },
      { prevState: [[0], [0]], nextState: [[0], [0]] },
      { prevState: [[1]], nextState: [[0]] },
      { prevState: [[0], [1]], nextState: [[0], [0]] },
      {
        prevState: [
          [1, 1],
          [1, 0],
        ],
        nextState: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        prevState: [
          [1, 1],
          [1, 1],
        ],
        nextState: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        prevState: [
          [1, 1, 1],
          [1, 1, 1],
        ],
        nextState: [
          [1, 0, 1],
          [1, 0, 1],
        ],
      },
      {
        prevState: [
          [1, 0, 1],
          [1, 0, 1],
        ],
        nextState: [
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
    ].forEach((suite) => {
      it(`for state ${numsToStr(suite.prevState)} the next is ${numsToStr(
        suite.nextState
      )}`, () => {
        expect(getNextGeneration(numsToCellState(suite.prevState))).toEqual(
          suite.nextState
        );
      });
    });
  });

  describe("Function toggleCellState Invert Cell state", () => {
    [
      [STATE_ALIVE, STATE_DEAD],
      [STATE_WEAK, STATE_DEAD],
      [STATE_DEAD, STATE_ALIVE],
      [STATE_RAISE, STATE_ALIVE],
    ].forEach(([stateBefore, stateAfter]) => {
      it(`Cell state before: ${stateBefore}, after: ${stateAfter}`, () => {
        expect(toggleCellState(STATE_ALIVE)).toEqual(STATE_DEAD);
      });
    });
  });
});
