import { Game } from "../src/control/Game";
import { CellState } from "../src/model/utils";
import { IGameField } from "../src/model/GameField";
import { GameState, IGameView } from "../src/view/GameView";

const sleep = (x: number) => new Promise((res) => setTimeout(res, x));

describe("Game", () => {
  const stepDuration = 100;

  let gameField: IGameField;
  let gameView: IGameView;

  let isGameOver = false;

  let fieldState: CellState[][];
  const gameState: GameState = {
    isPlaying: false,
    smartMode: true,
    gameOver: false,
    clearField: false,
    stepMs: stepDuration,
    caption: "",
  };

  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onCellClick = jest.fn();

  const getGameField = (): IGameField => ({
    getState: jest.fn(() => fieldState),
    toggleCell: jest.fn(),
    nextGeneration: jest.fn(() => fieldState),
    setSize: jest.fn(),
    clear: jest.fn(),
    isGameOver: jest.fn(() => isGameOver),
    applyTemplate: jest.fn(),
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
    fieldState = [
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
    beforeEach(() => {
      new Game(gameField, gameView, stepDuration);
    });

    it("renders initial state on instantiating", () => {
      expect(gameField.getState).toBeCalled();
      expect(gameView.updateGameField).toBeCalledWith(fieldState);
      expect(gameView.updateGameState).toBeCalledWith(gameState);
    });

    it("interaction view.onCellClick raises field.toggleCellState and renders with updated state", () => {
      expect(gameField.toggleCell).toHaveBeenCalledTimes(0);

      onCellClick(0, 0);
      expect(gameField.toggleCell).toHaveBeenCalledWith(0, 0);
      expect(gameView.updateGameField).toHaveBeenCalled();
    });

    it("interaction view.onFieldSizeChange raises field.setSize() and renders with updated state", () => {
      expect(gameField.setSize).toHaveBeenCalledTimes(1);
      expect(gameField.setSize).toHaveBeenCalledWith(1, 0);

      onFieldSizeChange(11, 12);
      expect(gameField.setSize).toHaveBeenCalledWith(11, 12);
      expect(gameView.updateGameField).toHaveBeenCalled();
    });

    it("interaction view.clearField raises field.clear() and renders updated game field", () => {
      expect(gameField.clear).not.toHaveBeenCalled();

      onGameStateChange({ clearField: true });

      expect(gameField.clear).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalled();
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

    it("stop the game and send caption if gameField.isGameOver()", async () => {
      onGameStateChange({
        isPlaying: true,
        stepMs: 100,
      });

      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          isPlaying: true,
          caption: "",
        })
      );

      isGameOver = true;
      await sleep(100);

      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          isPlaying: false,
          caption: "Game over!",
        })
      );
    });
  });
});
