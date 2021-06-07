import { CellState, STATE_ALIVE } from "../model/utils";

export type GameState = {
  height: number;
  width: number;
  isPlaying: boolean;
};

export type FieldCellChange = (row: number, column: number) => void;
export type GameStateChange = (newState: boolean) => void;

export interface IGameView {
  updateGameField(cellStates: CellState[][]): void;
  updateGameState(state: GameState): void;
  onCellClick(cb: FieldCellChange): void;
  onGameStateChange(cb: GameStateChange): void;
  onFieldSizeChange(cb: FieldCellChange): void;
}

export class GameWiew implements IGameView {
  el: HTMLElement;
  gameState: GameState = {
    height: 1,
    width: 0,
    isPlaying: false,
  };

  cbCellClick: FieldCellChange | undefined;

  cbGameStateChange: GameStateChange | undefined;

  cbFieldSizeChange: FieldCellChange | undefined;

  constructor(parentElement: HTMLElement) {
    this.el = parentElement;
    this.render();
  }

  private onInputChange(name: string, inputElement: HTMLInputElement) {
    console.log("onInputChange");

    if (this.cbFieldSizeChange) {
      const newHeight: number =
        name === "height" ? Number(inputElement.value) : this.gameState.height;
      const newWidth: number =
        name === "width" ? Number(inputElement.value) : this.gameState.width;

      this.cbFieldSizeChange(newHeight, newWidth);
    }
  }

  render(): void {
    const newEl = this.el;

    const gameField: HTMLElement = document.createElement("div");
    gameField.classList.add("gameField");
    newEl.append(gameField);

    const gameControls: HTMLElement = document.createElement("div");
    gameControls.classList.add("gameControls");
    newEl.append(gameControls);

    const buttonPlay: HTMLElement = document.createElement("button");
    buttonPlay.classList.add("run-button");
    buttonPlay.addEventListener("click", () => {
      if (this.cbGameStateChange) {
        this.cbGameStateChange(this.gameState.isPlaying);
      }
    });
    newEl.append(buttonPlay);

    const onInputChange = function (
      el: HTMLElement,
      cb: FieldCellChange | undefined
    ) {
      if (cb) {
        const inputHeight: HTMLInputElement = el.querySelector(
          "input.field-size.field-size--height"
        ) as HTMLInputElement;
        const inputWidth: HTMLInputElement = el.querySelector(
          "input.field-size.field-size--width"
        ) as HTMLInputElement;

        cb(Number(inputHeight.value), Number(inputWidth.value));
      }
    };

    const inputHeight: HTMLInputElement = document.createElement("input");
    inputHeight.classList.add("field-size", "field-size--height");
    inputHeight.type = "number";
    inputHeight.addEventListener("change", () => {
      onInputChange(this.el, this.cbFieldSizeChange);
    });
    newEl.append(inputHeight);

    const inputWidth: HTMLInputElement = document.createElement("input");
    inputWidth.classList.add("field-size", "field-size--width");
    inputWidth.type = "number";
    inputWidth.addEventListener("change", () => {
      onInputChange(this.el, this.cbFieldSizeChange);
    });
    newEl.append(inputWidth);

    this.el = newEl;
    this.updateGameState(this.gameState);
  }

  public updateGameField(cellStates: CellState[][]): void {
    const table: string = cellStates
      .map((range: CellState[], y: number) => {
        return `<tr>${range
          .map((state: CellState, x: number) => {
            if (state === STATE_ALIVE) {
              return `<td 
            data-y=${y}
            data-x=${x}
          class="cell cell--alive" 
          style="background-color:#FA58D0; height:10px; width:10px;"></td>`;
            }
            return `<td 
          data-y=${y}
          data-x=${x}
        class="cell cell--dead" 
        style="background-color:#FFFFFF; height:10px; width:10px;"></td>`;
          })
          .join("")}</tr>`;
      })
      .join("");

    this.el.innerHTML = `<table>${table}</table>`;

    this.el.addEventListener("click", (ev) => {
      if (this.cbCellClick) {
        const target = ev.target as HTMLElement;
        if (target.matches(".cell[data-y][data-x]")) {
          const y = Number(target.getAttribute("data-y"));
          const x = Number(target.getAttribute("data-x"));
          this.cbCellClick(y, x);
        }
      }
    });
  }

  public updateGameState(state: GameState): void {
    this.gameState = state;

    const inputHeight: HTMLInputElement = this.el.querySelector(
      "input.field-size.field-size--height"
    ) as HTMLInputElement;
    inputHeight.value = `${this.gameState.height}`;

    const inputWidth: HTMLInputElement = this.el.querySelector(
      "input.field-size.field-size--width"
    ) as HTMLInputElement;
    inputWidth.value = `${this.gameState.width}`;

    const buttonPlay: HTMLButtonElement = this.el.querySelector(
      "button.run-button"
    ) as HTMLButtonElement;
    if (this.gameState.isPlaying) {
      buttonPlay.innerHTML = "Stop";
      buttonPlay.classList.add("run-button--playing");
      buttonPlay.classList.remove("run-button--stopped");
    } else {
      buttonPlay.innerHTML = "Play";
      buttonPlay.classList.add("run-button--stopped");
      buttonPlay.classList.remove("run-button--playing");
    }
  }

  public onCellClick(cb: FieldCellChange): void {
    this.cbCellClick = cb;
  }

  public onGameStateChange(cb: GameStateChange): void {
    this.cbGameStateChange = cb;
  }

  public onFieldSizeChange(cb: FieldCellChange): void {
    this.cbFieldSizeChange = cb;
  }
}
