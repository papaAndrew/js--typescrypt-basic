import { Game } from "../src/control/Game";
import { CellState } from "../src/model/utils";
import { IGameField } from "../src/model/GameField";
import { GameState, IGameView } from "../src/view/GameView";

const sleep = (x: number) => new Promise((res) => setTimeout(res, x));

describe("Game", () => {
  const stepDuration = 100;
  let state: CellState[][];
  let gameField: IGameField;
  let gameView: IGameView;

  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onStepDurationChange = jest.fn();
  let onCellClick = jest.fn();

  const getGameField = (): IGameField => ({
    getState: jest.fn(() => state),
    toggleCell: jest.fn(),
    nextGeneration: jest.fn(),
    setSize: jest.fn(),
  });

  const getGameView = (): IGameView => ({
    updateGameField: jest.fn(),
    updateGameState: jest.fn(),
    onCellClick: jest.fn((cb) => {
      onCellClick = jest.fn(cb);
    }),
    onGameStateChange: jest.fn((cb) => {
      onGameStateChange = jest.fn(cb);
    }),
    onFieldSizeChange: jest.fn((cb) => {
      onFieldSizeChange = jest.fn(cb);
    }),
    onStepDurationChange: jest.fn((cb) => {
      onStepDurationChange = jest.fn(cb);
    }),
  });

  beforeEach(() => {
    state = [
      [Math.random() as CellState, Math.random() as CellState],
      [Math.random() as CellState, Math.random() as CellState],
      [Math.random() as CellState, Math.random() as CellState],
    ];
    gameView = getGameView();
    gameField = getGameField();
  });

  it("is a class", () => {
    expect(Game).toBeInstanceOf(Function);
    expect(new Game(gameField, gameView)).toBeInstanceOf(Game);
  });

  describe("functionality", () => {
    //let game: Game;
    beforeEach(() => {
      new Game(gameField, gameView, stepDuration);
    });

    it("renders initial state on instantiating", () => {
      const gameState: GameState = {
        height: state.length,
        width: state[0].length,
        isPlaying: false,
        stepMs: stepDuration,
      };

      expect(gameField.getState).toBeCalled();
      expect(gameView.updateGameField).toBeCalledWith(state);
      expect(gameView.updateGameState).toBeCalledWith(gameState);
    });

    it("calls field.toggleCellState on view.cellClick and renders with updated state", () => {
      state = [[0, 0, 0]];
      onCellClick(0, 1);

      expect(gameField.toggleCell).toHaveBeenCalledWith(0, 1);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });

    it("calls field.setSize on view.onFieldSizeChange and renders with updated state", () => {
      state = [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
      ];
      const height = state.length;
      const width = state[0].length;

      onFieldSizeChange(height, width);

      expect(gameField.setSize).toHaveBeenCalledWith(height, width);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({ height, width })
      );
    });

    it("is able to start/stop game with onGameStateChange", async () => {
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);

      await sleep(stepDuration);

      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);

      onGameStateChange(true);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      onGameStateChange(true);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameField.getState).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(6);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
      expect(gameField.getState).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(7);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameField.getState).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(8);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(9);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(9);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(9);
    });

    it("can change game speed by onStepDurationChange", async () => {
      onGameStateChange(true);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(100);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      onStepDurationChange(200);

      await sleep(100);
      // последняя сработка на 100, только что стратануло на 200
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      await sleep(100);
      // не прошло 200
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      await sleep(200);
      // прошло 2*200
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
    });
  });
});
