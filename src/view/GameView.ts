import { CellState, STATE_ALIVE, STATE_WEAK } from "../model/utils";

export type GameState = {
  isPlaying: boolean;
  smartMode: boolean;
  gameOver: boolean;
  clearField: boolean;
  stepMs: number;
  caption: string;
};

export type FieldCellChange = (row: number, column: number) => void;
export type GameStateChange = (newState: Partial<GameState>) => void;

export interface IGameView {
  updateGameField(cellStates: CellState[][]): void;
  updateGameState(state: GameState): void;
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
function getMsgBoxElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector("div.msg-box") as HTMLDivElement;
  } else {
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("msg-box");
    return div;
  }
}
function getClearElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector("button.clear-button") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("clear-button");
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

export class GameView implements IGameView {
  private el: HTMLElement;
  private fieldHeight = 1;
  private fieldWidth = 0;

  private cbCellClick: FieldCellChange | undefined;

  private cbGameStateChange: GameStateChange | undefined;

  private cbFieldSizeChange: FieldCellChange | undefined;

  constructor(parentElement: HTMLElement) {
    this.el = parentElement;
    this.render();
  }

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
          isPlaying: true,
        });
    });
    controlPanel.append(buttonPlay);

    const buttonClear: HTMLElement = getClearElement();
    buttonClear.addEventListener("click", () => {
      this.cbGameStateChange &&
        this.cbGameStateChange({
          clearField: true,
        });
    });
    buttonClear.innerHTML = "Clear";
    controlPanel.append(buttonClear);

    const msgBox: HTMLElement = getMsgBoxElement();
    controlPanel.append(msgBox);

    newEl.append(controlPanel);

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

  private updateFieldSize(fieldState: CellState[][]) {
    this.fieldHeight = fieldState.length;
    this.fieldWidth = fieldState[0]?.length || 0;

    const controlPanel = getControlPanelElement(this.el);

    getSizeYElement(controlPanel).value = `${this.fieldHeight}`;

    getSizeXElement(controlPanel).value = `${this.fieldWidth}`;
  }

  public updateGameField(fieldState: CellState[][]): void {
    this.updateFieldSize(fieldState);

    const tbody: string = fieldState
      .map((range: CellState[], y: number) => {
        return `<tr>${range
          .map((state: CellState, x: number) => {
            switch (state) {
              case STATE_ALIVE:
                return `<td data-y=${y} data-x=${x} class="cell cell--alive">&#10059;</td>`;
              case STATE_WEAK:
                return `<td data-y=${y} data-x=${x} class="cell cell--alive cell--weak">&#10042;</td>`;
              default:
                return `<td data-y=${y} data-x=${x} class="cell cell--dead"></td>`;
            }
          })
          .join("")}</tr>`;
      })
      .join("");

    getFieldTableElement(this.el).innerHTML = `<tbody>${tbody}</tbody>`;
  }

  private setGameSpeed(stepMs: number) {
    if (stepMs <= 0) {
      return;
    }

    const controlPanel = getControlPanelElement(this.el);
    getStepDurationElement(controlPanel).value = `${stepMs}`;
  }
  private setIsPlaying(isPlaying: boolean) {
    const controlPanel = getControlPanelElement(this.el);
    const buttonPlay: HTMLElement = getPlayElement(controlPanel);

    if (isPlaying) {
      buttonPlay.innerHTML = "Stop";
      buttonPlay.classList.add("run-button--playing");
      buttonPlay.classList.remove("run-button--stopped");
    } else {
      buttonPlay.innerHTML = "Play";
      buttonPlay.classList.add("run-button--stopped");
      buttonPlay.classList.remove("run-button--playing");
    }
  }
  private setCaption(caption: string) {
    const controlPanel = getControlPanelElement(this.el);
    const msgBox = getMsgBoxElement(controlPanel);
    msgBox.innerHTML = caption;
    if (caption) {
      msgBox.classList.add("alarm");
    } else {
      msgBox.classList.remove("alarm");
    }
  }

  public updateGameState(gameState: Partial<GameState>): void {
    if ("stepMs" in gameState) {
      this.setGameSpeed(gameState.stepMs || 0);
    }
    if ("isPlaying" in gameState) {
      this.setIsPlaying(gameState.isPlaying || false);
    }
    if ("caption" in gameState) {
      this.setCaption(gameState.caption || "");
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
