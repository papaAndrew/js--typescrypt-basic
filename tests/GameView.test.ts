import { GameWiew } from "../src/view/GameView";

describe("gameView", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  describe("public interface", () => {
    it("is a class", () => {
      expect(GameWiew).toBeInstanceOf(Function);
      expect(new GameWiew(el)).toBeInstanceOf(GameWiew);
    });

    it("renders some initial markup on construction", () => {
      new GameWiew(el);

      expect(el.querySelector(".game-field")).not.toBeNull();
      expect(el.querySelector(".control-panel")).not.toBeNull();
    });

    it("has public methods", () => {
      const gameView = new GameWiew(el);

      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      //expect(gameView.getGameState).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    let gameView: GameWiew;
    beforeEach(() => {
      gameView = new GameWiew(el);
    });

    it("renders field from .updateGameField when game stopped", () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(2);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(2);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);

      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(1);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(3);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);

      gameView.updateGameField([
        [0, 0, 1],
        [1, 0, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(6);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(3);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(3);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);

      gameView.updateGameField([
        [1, 1, 1],
        [1, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(6);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(6);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(0);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);
    });

    it("renders field from .updateGameField when game started then paused", () => {
      gameView.updateGameField([
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);

      gameView.updateGameState({ isPlaying: true });

      gameView.updateGameField([
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(2);

      gameView.updateGameState({ isPaused: true });

      gameView.updateGameField([
        [0, 0, 0],
        [1, 0, 1],
        [0, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(2);

      gameView.updateGameState({ isPaused: false });

      gameView.updateGameField([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(1);

      gameView.updateGameState({ isPlaying: false });

      gameView.updateGameField([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(0);
    });

    it("change field size", () => {
      gameView.updateGameField([[]]);

      const inputHeight: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--height"
      ) as HTMLInputElement;
      expect(inputHeight).not.toBeNull();

      const inputWidth: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--width"
      ) as HTMLInputElement;
      expect(inputWidth).not.toBeNull();

      expect(Number(inputHeight.value)).toBe(1);
      expect(Number(inputWidth.value)).toBe(0);

      gameView.updateGameField([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
      expect(Number(inputHeight.value)).toBe(3);
      expect(Number(inputWidth.value)).toBe(4);

      gameView.updateGameField([
        [0, 0],
        [0, 0],
      ]);
      expect(Number(inputHeight.value)).toBe(2);
      expect(Number(inputWidth.value)).toBe(2);
    });

    it("calls function .onCellClick on field interaction", () => {
      const onCellClick = jest.fn();
      gameView.onCellClick(onCellClick);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      el.querySelector(".cell.cell--alive")?.dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onCellClick).toHaveBeenCalledWith(1, 0);

      el.querySelectorAll(".cell.cell--dead")[1].dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onCellClick).toHaveBeenCalledWith(0, 1);
    });

    it("renders correct game state on .updateGameState", () => {
      gameView.updateGameState({
        isPlaying: false,
        isPaused: false,
        stepMs: 1000,
      });

      expect(
        el.querySelector(".run-button.run-button--stopped")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--stopped")?.innerHTML
      ).toBe("Play");

      expect(
        el.querySelector("button.pause-button.pause-button--on")
      ).toBeNull();
      expect(
        el.querySelector("button.pause-button.pause-button--off")
      ).not.toBeNull();
      expect(
        el.querySelector(".pause-button.pause-button--off")?.innerHTML
      ).toBe("Pause");

      const stepDuration: HTMLInputElement = el.querySelector(
        "input[type='range'].game-state.step-duration"
      ) as HTMLInputElement;
      expect(stepDuration).not.toBeNull();
      expect(Number(stepDuration.value)).toBe(1000);

      gameView.updateGameState({
        isPlaying: true,
        isPaused: true,
        stepMs: 300,
      });

      expect(el.querySelector(".run-button.run-button--stopped")).toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")?.innerHTML
      ).toBe("Stop");

      expect(
        el.querySelector("button.pause-button.pause-button--off")
      ).toBeNull();
      expect(
        el.querySelector("button.pause-button.pause-button--on")
      ).not.toBeNull();
      expect(
        el.querySelector(".pause-button.pause-button--on")?.innerHTML
      ).toBe("Continue");

      expect(Number(stepDuration.value)).toBe(300);
    });

    it("calls function from .onGameStateChange on control interaction", () => {
      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);

      el.querySelector(".run-button.run-button--stopped")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isPlaying: true,
        })
      );

      gameView.updateGameState({ isPlaying: true });
      el.querySelector(".pause-button.pause-button--off")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[1][0]).toEqual(
        expect.objectContaining({
          isPaused: true,
        })
      );

      gameView.updateGameState({ isPaused: true });

      el.querySelector(".pause-button.pause-button--on")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[2][0]).toEqual(
        expect.objectContaining({
          isPaused: false,
        })
      );

      el.querySelector(".run-button.run-button--playing")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[3][0]).toEqual(
        expect.objectContaining({
          isPlaying: false,
        })
      );
    });

    it("calls .onFieldSizeChange on field size change interaction", () => {
      const inputHeight: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--height"
      ) as HTMLInputElement;
      const inputWidth: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--width"
      ) as HTMLInputElement;

      const onFieldSizeChange = jest.fn();
      gameView.onFieldSizeChange(onFieldSizeChange);

      [
        [33, 66],
        [22, 12],
        [1, 2],
      ].forEach(([height, width]) => {
        inputHeight.value = `${height}`;
        inputHeight.dispatchEvent(new Event("change", { bubbles: true }));

        inputWidth.value = `${width}`;
        inputWidth.dispatchEvent(new Event("change", { bubbles: true }));

        expect(onFieldSizeChange).toBeCalledWith(height, width);
      });
    });

    it("calls function from .onGameStateChange on control Step Size interaction", () => {
      const inputStep: HTMLInputElement = el.querySelector(
        "input[type='range'].game-state.step-duration"
      ) as HTMLInputElement;

      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);
      inputStep.value = "100";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onGameStateChange).toHaveBeenCalledWith({ stepMs: 100 });

      inputStep.value = "5555";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      // max = 2000
      expect(onGameStateChange).toHaveBeenCalledWith({ stepMs: 2000 });
    });
  });
});
