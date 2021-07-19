import { GameView } from "./GameView";

describe("gameView", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  describe("public interface", () => {
    it("is a class", () => {
      expect(GameView).toBeInstanceOf(Function);
      expect(new GameView(el)).toBeInstanceOf(GameView);
    });

    it("renders some initial markup on construction", () => {
      new GameView(el);

      expect(el.querySelector(".game-field")).not.toBeNull();

      const controlPanel: HTMLElement = el.querySelector(
        ".control-panel"
      ) as HTMLElement;
      expect(controlPanel).not.toBeNull();
      expect(controlPanel.querySelector(".msg-box")).not.toBeNull();
      expect(controlPanel.querySelector(".clear-button")).not.toBeNull();
    });

    it("has public methods", () => {
      const gameView = new GameView(el);

      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    let gameView: GameView;
    beforeEach(() => {
      gameView = new GameView(el);
    });

    it("renders field from .updateGameField", () => {
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

      // for example? glider
      gameView.updateGameField([
        [0, 3, 0],
        [2, 0, 1],
        [3, 1, 1],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(2);

      gameView.updateGameField([
        [3, 0, 1],
        [2, 3, 1],
        [0, 1, 2],
      ]);
      expect(el.querySelectorAll(".cell").length).toBe(9);
      expect(el.querySelectorAll(".cell.cell--alive").length).toBe(5);
      expect(el.querySelectorAll(".cell.cell--dead").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell--weak").length).toBe(2);
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
        stepMs: 1000,
      });

      expect(
        el.querySelector(".run-button.run-button--stopped")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--stopped")?.innerHTML
      ).toBe("Play");

      const stepDuration: HTMLInputElement = el.querySelector(
        "input[type='range'].game-state.step-duration"
      ) as HTMLInputElement;
      expect(stepDuration).not.toBeNull();
      expect(Number(stepDuration.value)).toBe(1000);

      gameView.updateGameState({
        isPlaying: true,
        stepMs: 300,
      });

      expect(el.querySelector(".run-button.run-button--stopped")).toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")
      ).not.toBeNull();
      expect(
        el.querySelector(".run-button.run-button--playing")?.innerHTML
      ).toBe("Stop");

      expect(Number(stepDuration.value)).toBe(300);

      gameView.updateGameState({
        caption: "Test",
      });

      expect(el.querySelector(".msg-box")?.innerHTML).toBe("Test");

      gameView.updateGameState({
        caption: "",
      });

      expect(el.querySelector(".msg-box")?.innerHTML).toBe("");
    });

    it("calls function from .onGameStateChange on control interaction", () => {
      gameView.updateGameState({
        isPlaying: false,
      });

      const onGameStateChange = jest.fn();
      gameView.onGameStateChange(onGameStateChange);

      //console.log("here", el.querySelector(".run-button.run-button--stopped"));
      el.querySelector(".run-button.run-button--stopped")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isPlaying: true,
        })
      );

      gameView.updateGameState({ isPlaying: true });

      el.querySelector(".run-button.run-button--playing")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[1][0]).toEqual(
        expect.objectContaining({
          isPlaying: true,
        })
      );
      const inputStep: HTMLInputElement = el.querySelector(
        "input[type='range'].game-state.step-duration"
      ) as HTMLInputElement;

      inputStep.value = "100";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      expect(onGameStateChange.mock.calls[2][0]).toEqual(
        expect.objectContaining({
          stepMs: 100,
        })
      );

      inputStep.value = "5555";
      inputStep?.dispatchEvent(new Event("change", { bubbles: true }));
      // max = 2000
      expect(onGameStateChange.mock.calls[3][0]).toEqual(
        expect.objectContaining({ stepMs: 2000 })
      );

      el.querySelector("button.clear-button")?.dispatchEvent(
        new Event("click", { bubbles: true })
      );
      expect(onGameStateChange.mock.calls[4][0]).toEqual(
        expect.objectContaining({
          clearField: true,
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
  });
});
