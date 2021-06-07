import { GameField } from "../src/model/GameField";
import { CellState } from "../src/model/utils";

function createFieldWithState(cellState: number[][]): GameField {
  const h: number = cellState.length;

  if (cellState[0]) {
    const w: number = cellState[0].length;
    const gameField = new GameField(h, w);
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (cellState[y][x]) {
          gameField.toggleCell(y, x);
        }
      }
    }
    return gameField;
  } else {
    return new GameField(h);
  }
}

describe("Use GameField", () => {
  describe("creates game field spicified size", () => {
    [
      [10, 0],
      [1, 100],
      [3, 1],
    ].forEach(([height, width]) => {
      it(`creates game field with size ${height} x ${width}`, () => {
        const fieldState = new GameField(height, width).getState();

        expect(fieldState.length).toBe(height);
        expect(fieldState[height - 1].length).toBe(width);
      });
    });
  });

  describe("can change field size", () => {
    const gameField = new GameField(0);
    [
      [10, 0],
      [1, 100],
      [3, 1],
    ].forEach(([height, width]) => {
      it(`set field size to ${height} x ${width}`, () => {
        gameField.setSize(height, width);

        expect(gameField.getState().length).toBe(height);
        expect(gameField.getState()[height - 1].length).toBe(width);
      });
    });
  });

  describe("specified cell can be toggled", () => {
    const stateOff: CellState = 0;
    const stateOn: CellState = 1;
    const gameField = new GameField(3, 3);

    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        it(`Cell[${y}, ${x}]'s state "${stateOff}" toggles to "${stateOn}"`, () => {
          expect(gameField.getState()[y][x]).toBe(stateOff);

          gameField.toggleCell(y, x);

          expect(gameField.getState()[y][x]).toBe(stateOn);
        });

        it(`Cell[${y}, ${x}]'s state "${stateOn}" goes to "${stateOff}" again`, () => {
          gameField.toggleCell(y, x);

          expect(gameField.getState()[y][x]).toBe(stateOff);
        });
      }
    }
  });

  describe("nextGeneration()", () => {
    [
      {
        prevState: [[0]],
        nextState: [[0]],
      },
      {
        prevState: [[0, 0]],
        nextState: [[0, 0]],
      },
      {
        prevState: [[1]],
        nextState: [[0]],
      },
      {
        prevState: [[0, 1]],
        nextState: [[0, 0]],
      },
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
      it(`if cells ${JSON.stringify(
        suite.prevState
      )} toggled so next state is according to ${JSON.stringify(
        suite.nextState
      )}`, () => {
        const gameField: GameField = createFieldWithState(suite.prevState);

        const nextState: CellState[][] = gameField.nextGeneration();

        expect(nextState).toEqual(suite.nextState);
      });
    });
  });

  describe("isAnyoneAlive", () => {
    [
      {
        fieldState: [],
        hasAlive: false,
      },
      {
        fieldState: [[]],
        hasAlive: false,
      },
      {
        fieldState: [[1]],
        hasAlive: true,
      },
      {
        fieldState: [[1], [0]],
        hasAlive: true,
      },
      {
        fieldState: [[0], [0]],
        hasAlive: false,
      },
    ].forEach((suite) => {
      it(`should return ${suite.hasAlive} for ${JSON.stringify(
        suite.fieldState
      )}`, () => {
        const gameField = createFieldWithState(suite.fieldState);

        expect(gameField.isAnyoneAlive()).toBe(suite.hasAlive);
      });
    });
  });
});
