import {
  Cell,
  getMatrix,
  getNextGeneration,
  toggleCellState,
} from "../src/lib/utils";

/**
 * @param {Cell[][]} field
 * @returns string
 */
function fieldToStr(field: Cell[][]) {
  return `\n${field
    .map((line) => line.map((cell) => cell.state).join(""))
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
        matrix.forEach((line: Cell[]) => {
          it(`length of this row is ${width} Cells`, () => {
            expect(line.length).toBe(width);
          });
        });
      });
    });
  });

  describe("Function getNextGeneration calculate new state of matrix depended of combinations", () => {
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

    [
      { field: [[O]], nextState: [[O]] },
      { field: [[O], [O]], nextState: [[O], [O]] },
      { field: [[I]], nextState: [[O]] },
      { field: [[O], [I]], nextState: [[O], [O]] },
      {
        field: [
          [I, I],
          [I, O],
        ],
        nextState: [
          [I, I],
          [I, I],
        ],
      },
      {
        field: [
          [I, I],
          [I, I],
        ],
        nextState: [
          [I, I],
          [I, I],
        ],
      },
      {
        field: [
          [I, I, I],
          [I, I, I],
        ],
        nextState: [
          [I, O, I],
          [I, O, I],
        ],
      },
      {
        field: [
          [I, O, I],
          [I, O, I],
        ],
        nextState: [
          [O, O, O],
          [O, O, O],
        ],
      },
    ].forEach((el) => {
      it(`for current ${fieldToStr(el.field)} the next is ${fieldToStr(
        el.nextState
      )}`, () => {
        expect(getNextGeneration(el.field)).toEqual(el.nextState);
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
