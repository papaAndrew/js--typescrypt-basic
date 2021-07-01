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
        isPlaying: false,
        isPaused: false,
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
    });

    it("is able to start/stop game with onGameStateChange", async () => {
      expect(gameField.getState).toHaveBeenCalledTimes(1);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);

      onGameStateChange({ isPlaying: true });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      onGameStateChange({ isPlaying: false });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      onGameStateChange({ isPlaying: true });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange({ isPlaying: false });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
    });

    it("is able to pause/contunue game with onGameStateChange", async () => {
      onGameStateChange({ isPlaying: true });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      onGameStateChange({ isPaused: true });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      onGameStateChange({ isPaused: false });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange({ isPaused: true });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);

      onGameStateChange({ isPlaying: false });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(6);

      await sleep(stepDuration);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(6);
    });

    it("can change game speed if stepMs changed", async () => {
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);

      await sleep(100);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);

      onGameStateChange({
        isPlaying: true,
        stepMs: 100,
      });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(100);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      await sleep(100);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);

      onGameStateChange({ stepMs: 200 });

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(100);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(100);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);

      await sleep(200);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
    });
  });
});
