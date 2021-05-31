import { GameField } from "../src/control/gameField";
import {
  Cell,
  CellState,
  getMatrix,
  toggleCellState,
  countAliveNeighbors,
  getNextGeneration,
} from "../src/lib/utils";

function numsToCells(nums: number[][]): Cell[][] {
  const numToState = function (num: number): CellState {
    return num === 0 ? 0 : 1;
  };

  return nums.map((range, y) =>
    range.map((value, x) => {
      return { row: y, col: x, state: numToState(value) };
    })
  );
}

function numsToStr(mx: number[][]) {
  return `\n${mx
    .map((line) => line.map((item) => item).join(""))
    .join("\n")}\n`;
}

describe.skip("Test utilities", () => {
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
        matrix.forEach((line: Cell[]) => {
          it(`length of this row is ${width} Cells`, () => {
            expect(line.length).toBe(width);
          });
        });
      });
    });
  });

  describe("tesing countAliveNeighbors", () => {
    [
      { states: [[0, 1]], neighbors: [[1, 0]] },
      {
        states: [
          [0, 1],
          [0, 1],
        ],
        neighbors: [
          [2, 1],
          [2, 1],
        ],
      },
      {
        states: [
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
        suite.states
      )} neighbors number is ${numsToStr(suite.neighbors)}`, () => {
        const gameField: Cell[][] = numsToCells(suite.states);

        for (let y = 0; y < gameField.length; y++) {
          const range: Cell[] = gameField[y];
          for (let x = 0; x < range.length; x++) {
            const cell: Cell = range[x];
            const expectedValue = suite.neighbors[y][x];
            it(`cell[${y}:${x}] have ${expectedValue} neighbours`, () => {
              expect(countAliveNeighbors(gameField, cell)).toBe(expectedValue);
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
        const fieldExpected: Cell[][] = numsToCells(suite.nextState);
        const fieldBefore: Cell[][] = numsToCells(suite.prevState);
        const fieldAfter: Cell[][] = getNextGeneration(fieldBefore);

        expect(fieldAfter).toEqual(fieldExpected);
      });
    });
  });

  describe("Function toggleCellState Invert Cell state", () => {
    const I: Cell = {
      row: 0,
      col: 0,
      state: 1,
    };
    /**
     * Cell dead
     */
    const O: Cell = {
      row: 0,
      col: 0,
      state: 0,
    };

    it(`Cell state before: ${I.state}, after: ${O.state}`, () => {
      expect(toggleCellState(I)).toEqual(O);
    });

    it(`Cell state before: ${O.state}, after: ${I.state}`, () => {
      expect(toggleCellState(O)).toEqual(I);
    });
  });
});
