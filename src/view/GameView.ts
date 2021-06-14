import { CellState, STATE_ALIVE } from "../model/utils";

export type GameState = {
  height: number;
  width: number;
  isPlaying: boolean;
  stepMs: number;
};

export type FieldCellChange = (row: number, column: number) => void;
export type GameStateChange = (newState: boolean) => void;
export type StepDurationChange = (stepDurationMs: number) => void;

export interface IGameView {
  updateGameField(cellStates: CellState[][]): void;
  updateGameState(state: GameState): void;
  onCellClick(cb: FieldCellChange): void;
  onGameStateChange(cb: GameStateChange): void;
  onFieldSizeChange(cb: FieldCellChange): void;
  onStepDurationChange(cd: StepDurationChange): void;
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
    input.type = "number";
    input.min = "100";
    input.step = "100";
    return input;
  }
}

function getTogglePlayElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector("button.run-button") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("run-button");
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
  private gameState: GameState = {
    height: 1,
    width: 0,
    isPlaying: false,
    stepMs: 1000,
  };
  //private filedState: CellState[][] = [[]];

  private cbCellClick: FieldCellChange | undefined;

  private cbGameStateChange: GameStateChange | undefined;

  private cbFieldSizeChange: FieldCellChange | undefined;

  private cbStepDurationChange: StepDurationChange | undefined;

  constructor(parentElement: HTMLElement) {
    this.el = parentElement;
    this.render();
  }

  /**
   * Отрисовка разметки при обновлении страницы
   */
  render(): void {
    const newEl = this.el;

    const controlPanel: HTMLElement = getControlPanelElement();

    const inputHeight: HTMLInputElement = getSizeYElement();
    inputHeight.addEventListener("change", (ev: Event) => {
      this.gameState.height = Number((ev.target as HTMLInputElement).value);
      if (this.cbFieldSizeChange) {
        this.cbFieldSizeChange(this.gameState.height, this.gameState.width);
      }
    });
    controlPanel.append(inputHeight);

    const inputWidth: HTMLInputElement = getSizeXElement();
    inputWidth.addEventListener("change", (ev: Event) => {
      this.gameState.width = Number((ev.target as HTMLInputElement).value);
      if (this.cbFieldSizeChange) {
        this.cbFieldSizeChange(this.gameState.height, this.gameState.width);
      }
    });
    controlPanel.append(inputWidth);

    const inputStep: HTMLInputElement = getStepDurationElement();
    inputStep.addEventListener("change", (ev: Event) => {
      this.gameState.stepMs = Number((ev.target as HTMLInputElement).value);
      if (this.cbStepDurationChange) {
        this.cbStepDurationChange(this.gameState.stepMs);
      }
    });
    controlPanel.append(inputStep);

    const buttonPlay: HTMLElement = getTogglePlayElement();
    buttonPlay.addEventListener("click", () => {
      if (this.cbGameStateChange) {
        this.cbGameStateChange(!this.gameState.isPlaying);
      }
    });
    controlPanel.append(buttonPlay);
    newEl.append(controlPanel);

    // игровое поле
    const gameFieldEl: HTMLElement = getGameFieldElement();

    const fieldTable: HTMLTableElement = getFieldTableElement();
    fieldTable.addEventListener("click", (ev) => {
      if (this.cbCellClick) {
        const target: HTMLElement = ev.target as HTMLElement;
        if (target.matches(".cell[data-y][data-x]")) {
          const y = Number(target.getAttribute("data-y"));
          const x = Number(target.getAttribute("data-x"));
          this.cbCellClick(y, x);
        }
      }
    });
    gameFieldEl.appendChild(fieldTable);
    newEl.append(gameFieldEl);

    this.el = newEl;
  }

  public updateGameField(fieldState: CellState[][]): void {
    const tbody: string = fieldState
      .map((range: CellState[], y: number) => {
        return `<tr>${range
          .map((state: CellState, x: number) => {
            if (state === STATE_ALIVE) {
              return `<td 
                data-y=${y}
                data-x=${x}
                class="cell cell--alive">&#10059;</td>`;
            }
            return `<td 
              data-y=${y}
              data-x=${x}
              class="cell cell--dead"></td>`;
          })
          .join("")}</tr>`;
      })
      .join("");

    getFieldTableElement(this.el).innerHTML = `<tbody>${tbody}</tbody>`;
  }

  public updateGameState(state: GameState): void {
    this.gameState = { ...state };

    const controlPanel = getControlPanelElement(this.el);

    const buttonPlay: HTMLElement = getTogglePlayElement(controlPanel);
    if (this.gameState.isPlaying) {
      buttonPlay.innerHTML = "Stop";
      buttonPlay.classList.add("run-button--playing");
      buttonPlay.classList.remove("run-button--stopped");
    } else {
      buttonPlay.innerHTML = "Play";
      buttonPlay.classList.add("run-button--stopped");
      buttonPlay.classList.remove("run-button--playing");
    }

    getStepDurationElement(controlPanel).value = `${this.gameState.stepMs}`;

    getSizeYElement(controlPanel).value = `${this.gameState.height}`;

    getSizeXElement(controlPanel).value = `${this.gameState.width}`;
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
  public onStepDurationChange(cb: StepDurationChange): void {
    this.cbStepDurationChange = cb;
  }
}
