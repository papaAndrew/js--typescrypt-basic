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
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
      expect(gameView.onStepDurationChange).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    let gameView: GameWiew;
    beforeEach(() => {
      gameView = new GameWiew(el);
    });

    it("renders field from .updateGameField", () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(2);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(2);

      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(1);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(3);

      gameView.updateGameField([
        [0, 0, 1],
        [1, 0, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(6);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(3);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(3);
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
        height: 1,
        width: 0,
        isPlaying: false,
        stepMs: 1000,
      });

      expect(
        el.querySelector(".run-button.run-button--stopped")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--stopped")?.innerHTML
      ).toBe("Play");

      const stepDuration: HTMLInputElement = el.querySelector(
        "input.game-state.step-duration"
      ) as HTMLInputElement;
      expect(stepDuration).not.toBeNull();
      expect(Number(stepDuration.value)).toBe(1000);

      const inputHeight: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--height"
      ) as HTMLInputElement;
      expect(inputHeight).not.toBeNull();
      expect(Number(inputHeight.value)).toBe(1);

      const inputWidth: HTMLInputElement = el.querySelector(
        "input[type='number'].field-size.field-size--width"
      ) as HTMLInputElement;
      expect(inputWidth).not.toBeNull();
      expect(Number(inputWidth.value)).toBe(0);

      gameView.updateGameState({
        height: 3,
        width: 4,
        isPlaying: true,
        stepMs: 10,
      });

      expect(el.querySelector(".run-button.run-button--stopped")).toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")?.innerHTML
      ).toBe("Stop");

      expect(Number(inputHeight.value)).toBe(3);
      expect(Number(inputWidth.value)).toBe(4);
      expect(Number(stepDuration.value)).toBe(10);
    });

    it("calls function from .onGameStateChange on control interaction", () => {
      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);
      gameView.updateGameState({
        height: 2,
        width: 3,
        isPlaying: true,
        stepMs: 10,
      });
      el.querySelector(".run-button.run-button--playing")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange).toHaveBeenCalledWith(false);

      gameView.updateGameState({
        height: 2,
        width: 3,
        isPlaying: false,
        stepMs: 10,
      });
      el.querySelector(".run-button.run-button--stopped")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[1][0]).toBe(true);
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

    it("calls function from .onStepDurationChange on control interaction", () => {
      const inputStep: HTMLInputElement = el.querySelector(
        "input[type='number'].game-state.step-duration"
      ) as HTMLInputElement;

      const onStepDurationChange = jest.fn();
      gameView.onStepDurationChange(onStepDurationChange);
      inputStep.value = "100";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onStepDurationChange).toHaveBeenCalledWith(100);

      inputStep.value = "5555";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onStepDurationChange.mock.calls[1][0]).toBe(5555);
    });
  });
});
