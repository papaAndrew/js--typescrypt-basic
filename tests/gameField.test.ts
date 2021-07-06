import { GameField } from "../src/model/GameField";
import { CellState } from "../src/model/utils";

function numsToStr(mx: number[][]) {
  return `\n${mx
    .map((line) => line.map((item) => item).join(" "))
    .join("\n")}\n`;
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

  describe("field clears and specified cell toggles", () => {
    const height = 4;
    const width = 4;
    const gameField = new GameField(height, width);
    const zeroState: CellState[][] = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    [
      [
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 1, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 0, 1, 0],
        [0, 1, 0, 0],
      ],
    ].forEach((state) => {
      it(`clears game field by .clear() then toggles state with map ${numsToStr(
        state
      )} and .getState() returns the same`, () => {
        gameField.clear();
        expect(gameField.getState()).toEqual(zeroState);

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            if (state[y][x] === 1) {
              gameField.toggleCell(y, x);
            }
          }
        }
        expect(gameField.getState()).toEqual(state);
      });
    });
  });

  describe("applyTemplate(), getState() and nextGeneration() in single mode", () => {
    const gameField: GameField = new GameField(1);

    [
      {
        getState: [[0]],
        nextGeneraton: [[0]],
      },
      {
        getState: [[0, 0]],
        nextGeneraton: [[0, 0]],
      },
      {
        getState: [[1]],
        nextGeneraton: [[0]],
      },
      {
        getState: [[0, 1]],
        nextGeneraton: [[0, 0]],
      },
      {
        getState: [
          [1, 1],
          [1, 0],
        ],
        nextGeneraton: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        getState: [
          [1, 1],
          [1, 1],
        ],
        nextGeneraton: [
          [1, 1],
          [1, 1],
        ],
      },
      {
        getState: [
          [1, 1, 1],
          [1, 1, 1],
        ],
        nextGeneraton: [
          [1, 0, 1],
          [1, 0, 1],
        ],
      },
      {
        getState: [
          [1, 0, 1],
          [1, 0, 1],
        ],
        nextGeneraton: [
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
    ].forEach((suite) => {
      it(`if cells ${numsToStr(
        suite.getState
      )} toggled so current state is the same and next state is ${numsToStr(
        suite.nextGeneraton
      )}`, () => {
        //const gameField: GameField = createFieldWithState(suite.getState);
        gameField.applyTemplate(suite.getState);

        const getState: CellState[][] = gameField.getState();
        expect(getState).toEqual(suite.getState);

        const nextGeneraton: CellState[][] = gameField.nextGeneration();
        expect(nextGeneraton).toEqual(suite.nextGeneraton);
      });
    });
  });

  describe("getState() and nextGeneration() in smart mode", () => {
    const initialState = [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    let thisState = [
      [0, 3, 0, 0],
      [2, 0, 1, 0],
      [3, 1, 1, 0],
      [0, 2, 0, 0],
    ];

    const gameField: GameField = new GameField(1);
    gameField.applyTemplate(initialState);

    [
      [
        [0, 0, 0, 0],
        [3, 0, 1, 0],
        [2, 3, 1, 0],
        [0, 1, 2, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 2, 3, 0],
        [3, 0, 1, 2],
        [0, 1, 1, 0],
      ],
      [
        [0, 0, 0, 0],
        [0, 3, 2, 0],
        [0, 0, 3, 1],
        [0, 1, 1, 2],
      ],
    ].forEach((smartState) => {
      it(`current state is ${numsToStr(thisState)}, next state is ${numsToStr(
        smartState
      )}`, () => {
        const currentState = gameField.getState(true);
        expect(currentState).toEqual(thisState);

        const nextState = gameField.nextGeneration(true);
        expect(nextState).toEqual(smartState);

        thisState = nextState;
      });
    });
  });

  describe("applyTemplate and isGameOver", () => {
    const gameField: GameField = new GameField(1);
    [
      {
        getState: [[0]],
        isGameOver: true,
      },
      {
        getState: [[1]],
        isGameOver: false,
      },
      {
        getState: [[1], [0]],
        isGameOver: false,
      },
      {
        getState: [[0], [0]],
        isGameOver: true,
      },
      {
        getState: [
          [1, 1],
          [1, 1],
        ],
        isGameOver: true,
      },
      {
        getState: [
          [0, 1, 1, 0],
          [1, 0, 0, 1],
          [0, 1, 1, 0],
        ],
        isGameOver: true,
      },
    ].forEach((suite) => {
      it(`should return ${suite.isGameOver} for ${numsToStr(
        suite.getState
      )}`, () => {
        gameField.applyTemplate(suite.getState);
        expect(gameField.isGameOver()).toBe(suite.isGameOver);
      });
    });
  });
});
