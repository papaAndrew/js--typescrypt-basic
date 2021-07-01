import { CellState, STATE_DEAD } from "../model/utils";

export type GameState = {
  isPlaying: boolean;
  isPaused: boolean;
  stepMs: number;
};

export type FieldCellChange = (row: number, column: number) => void;
export type GameStateChange = (newState: Partial<GameState>) => void;

export interface IGameView {
  updateGameField(cellStates: CellState[][]): void;
  updateGameState(state: Partial<GameState>): void;
  onCellClick(cb: FieldCellChange): void;
  onGameStateChange(cb: GameStateChange): void;
  onFieldSizeChange(cb: FieldCellChange): void;
}

function getSizeYElement(el?: HTMLElement): HTMLInputElement {
  if (el) {
    return el.querySelector(
      "input.field-size.field-size--height"
    ) as HTMLInputElement;
  } else {
    const input: HTMLInputElement = document.createElement("input");
    input.classList.add("field-size", "field-size--height");
    input.type = "number";
    input.min = "1";
    input.step = "1";
    return input;
  }
}

function getSizeXElement(el?: HTMLElement): HTMLInputElement {
  if (el) {
    return el.querySelector(
      "input.field-size.field-size--width"
    ) as HTMLInputElement;
  } else {
    const input: HTMLInputElement = document.createElement("input");
    input.classList.add("field-size", "field-size--width");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    return input;
  }
}

function getStepDurationElement(el?: HTMLElement): HTMLInputElement {
  if (el) {
    return el.querySelector(
      "input.game-state.step-duration"
    ) as HTMLInputElement;
  } else {
    const input: HTMLInputElement = document.createElement("input");
    input.classList.add("game-state", "step-duration");
    input.type = "range";
    input.min = "10";
    input.max = "2000";
    input.step = "10";
    return input;
  }
}

function getPlayElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector("button.run-button") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("run-button");
    return button;
  }
}

function getPauseElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector("button.pause-button") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("pause-button");
    return button;
  }
}

function getControlPanelElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector("div.control-panel") as HTMLDivElement;
  } else {
    const controlPanel: HTMLDivElement = document.createElement("div");
    controlPanel.classList.add("control-panel");
    return controlPanel;
  }
}

function getGameFieldElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector("div.game-field") as HTMLDivElement;
  } else {
    const gameField: HTMLDivElement = document.createElement("div");
    gameField.classList.add("game-field");
    return gameField;
  }
}

function getFieldTableElement(el?: HTMLElement): HTMLTableElement {
  if (el) {
    return el.querySelector("table.cells-grid") as HTMLTableElement;
  } else {
    const table: HTMLTableElement = document.createElement("table");
    table.classList.add("cells-grid");
    return table;
  }
}

export class GameWiew implements IGameView {
  private el: HTMLElement;
  private fieldHeight = 1;
  private fieldWidth = 0;

  private gameState: GameState = {
    isPlaying: false,
    isPaused: false,
    stepMs: 1000,
  };

  private nextGeneration: CellState[][] = [];

  private cbCellClick: FieldCellChange | undefined;

  private cbGameStateChange: GameStateChange | undefined;

  private cbFieldSizeChange: FieldCellChange | undefined;

  constructor(parentElement: HTMLElement) {
    this.el = parentElement;
    this.render();
    this.updateGameState(this.gameState);
  }

  private getGameState(): GameState {
    return this.gameState;
  }

  /**
   * Отрисовка разметки при обновлении страницы
   */
  render(): void {
    const newEl = this.el;

    const controlPanel: HTMLElement = getControlPanelElement();

    const inputHeight: HTMLInputElement = getSizeYElement();
    inputHeight.addEventListener("change", (ev: Event) => {
      this.fieldHeight = Number((ev.target as HTMLInputElement).value);
      this.cbFieldSizeChange &&
        this.cbFieldSizeChange(this.fieldHeight, this.fieldWidth);
    });
    controlPanel.append(inputHeight);

    const inputWidth: HTMLInputElement = getSizeXElement();
    inputWidth.addEventListener("change", (ev: Event) => {
      this.fieldWidth = Number((ev.target as HTMLInputElement).value);
      this.cbFieldSizeChange &&
        this.cbFieldSizeChange(this.fieldHeight, this.fieldWidth);
    });
    controlPanel.append(inputWidth);

    const inputStep: HTMLInputElement = getStepDurationElement();
    inputStep.addEventListener("change", (ev: Event) => {
      this.cbGameStateChange &&
        this.cbGameStateChange({
          stepMs: Number((ev.target as HTMLInputElement).value),
        });
    });
    controlPanel.append(inputStep);

    const buttonPlay: HTMLElement = getPlayElement();
    buttonPlay.addEventListener("click", () => {
      this.cbGameStateChange &&
        this.cbGameStateChange({
          isPlaying: !this.gameState.isPlaying,
        });
    });
    controlPanel.append(buttonPlay);
    newEl.append(controlPanel);

    const buttonPause: HTMLElement = getPauseElement();
    buttonPause.addEventListener("click", () => {
      this.cbGameStateChange &&
        this.cbGameStateChange({
          isPaused: !this.gameState.isPaused,
        });
    });
    controlPanel.append(buttonPause);

    newEl.append(controlPanel);

    // игровое поле
    const gameFieldEl: HTMLElement = getGameFieldElement();

    const fieldTable: HTMLTableElement = getFieldTableElement();
    fieldTable.addEventListener("click", (ev) => {
      const target: HTMLElement = ev.target as HTMLElement;
      if (target.matches(".cell[data-y][data-x]")) {
        const y = Number(target.getAttribute("data-y"));
        const x = Number(target.getAttribute("data-x"));
        this.cbCellClick && this.cbCellClick(y, x);
      }
    });
    gameFieldEl.appendChild(fieldTable);
    newEl.append(gameFieldEl);

    this.el = newEl;
  }

  private isCellWeak(y: number, x: number): boolean {
    if (y < this.nextGeneration.length && x < this.nextGeneration[y].length) {
      return this.nextGeneration[y][x] === STATE_DEAD;
    }
    return false;
  }

  private checkStop(fieldState: CellState[][]) {
    if (!this.gameState.isPlaying) {
      return;
    }

    if (
      fieldState.filter(
        (line: CellState[], y) =>
          line.filter((item, x) => item !== this.nextGeneration[y][x]).length >
          0
      ).length === 0
    ) {
      this.cbGameStateChange && this.cbGameStateChange({ isPlaying: false });
    }
  }

  private updateFieldSize(fieldState: CellState[][]) {
    this.fieldHeight = fieldState.length;
    this.fieldWidth = fieldState[0]?.length || 0;

    const controlPanel = getControlPanelElement(this.el);

    getSizeYElement(controlPanel).value = `${this.fieldHeight}`;

    getSizeXElement(controlPanel).value = `${this.fieldWidth}`;
  }

  public updateGameField(fieldState: CellState[][]): void {
    this.updateFieldSize(fieldState);

    let state = this.nextGeneration;
    this.nextGeneration = fieldState;

    if (this.gameState.isPaused) {
      return;
    }

    if (this.gameState.isPlaying) {
      this.checkStop(state);
    } else {
      state = fieldState;
    }

    const tbody: string = state
      .map((range: CellState[], y: number) => {
        return `<tr>${range
          .map((state: CellState, x: number) => {
            if (state === STATE_DEAD) {
              return `<td data-y=${y} data-x=${x} class="cell cell--dead"></td>`;
            } else if (this.isCellWeak(y, x)) {
              return `<td data-y=${y} data-x=${x} class="cell cell--alive cell--weak">&#10042;</td>`;
            } else {
              return `<td data-y=${y} data-x=${x} class="cell cell--alive">&#10059;</td>`;
            }
          })
          .join("")}</tr>`;
      })
      .join("");

    getFieldTableElement(this.el).innerHTML = `<tbody>${tbody}</tbody>`;
  }

  public updateGameState(newState: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...newState };
    const controlPanel = getControlPanelElement(this.el);

    getStepDurationElement(controlPanel).value = `${this.gameState.stepMs}`;

    const buttonPlay: HTMLElement = getPlayElement(controlPanel);
    if (this.gameState.isPlaying) {
      buttonPlay.innerHTML = "Stop";
      buttonPlay.classList.add("run-button--playing");
      buttonPlay.classList.remove("run-button--stopped");
    } else {
      buttonPlay.innerHTML = "Play";
      buttonPlay.classList.add("run-button--stopped");
      buttonPlay.classList.remove("run-button--playing");
    }

    const buttonPause: HTMLElement = getPauseElement(controlPanel);
    if (this.gameState.isPaused) {
      buttonPause.innerHTML = "Continue";
      buttonPause.classList.add("pause-button--on");
      buttonPause.classList.remove("pause-button--off");
    } else {
      buttonPause.innerHTML = "Pause";
      buttonPause.classList.add("pause-button--off");
      buttonPause.classList.remove("pause-button--on");
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
