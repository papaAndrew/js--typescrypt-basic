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

function getElementSizeY(el?: HTMLElement): HTMLInputElement {
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

function getElementSizeX(el?: HTMLElement): HTMLInputElement {
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

function getElementStepDuration(el?: HTMLElement): HTMLInputElement {
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

function getElementTogglePlay(el?: HTMLElement): HTMLButtonElement {
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

export class GameWiew implements IGameView {
  private el: HTMLElement;
  private gameState: GameState = {
    height: 1,
    width: 0,
    isPlaying: false,
    stepMs: 1000,
  };

  private cbCellClick: FieldCellChange | undefined;

  private cbGameStateChange: GameStateChange | undefined;

  private cbFieldSizeChange: FieldCellChange | undefined;

  private cbStepDurationChange: StepDurationChange | undefined;

  constructor(parentElement: HTMLElement) {
    this.el = parentElement;
    this.render();
  }

  private drawControlPanel() {
    const controlPanel: HTMLElement = getControlPanelElement();

    const buttonPlay: HTMLElement = getElementTogglePlay();
    buttonPlay.addEventListener("click", () => {
      if (this.cbGameStateChange) {
        this.cbGameStateChange(this.gameState.isPlaying);
      }
    });
    controlPanel.append(buttonPlay);

    const inputStep: HTMLInputElement = getElementStepDuration();
    inputStep.addEventListener("change", (ev: Event) => {
      if (this.cbStepDurationChange) {
        this.gameState.stepMs = Number((ev.target as HTMLInputElement).value);
        this.cbStepDurationChange(this.gameState.stepMs);
      }
    });
    controlPanel.append(inputStep);

    const inputHeight: HTMLInputElement = getElementSizeY();
    inputHeight.addEventListener("change", (ev: Event) => {
      if (this.cbFieldSizeChange) {
        this.gameState.height = Number((ev.target as HTMLInputElement).value);
        this.cbFieldSizeChange(this.gameState.height, this.gameState.width);
      }
    });
    controlPanel.append(inputHeight);

    const inputWidth: HTMLInputElement = getElementSizeX();
    inputWidth.addEventListener("change", (ev: Event) => {
      if (this.cbFieldSizeChange) {
        this.gameState.width = Number((ev.target as HTMLInputElement).value);
        this.cbFieldSizeChange(this.gameState.height, this.gameState.width);
      }
    });
    controlPanel.append(inputWidth);

    return controlPanel;
  }

  /**
   * Отрисовка разметки при обновлении страницы
   */
  render(): void {
    const newEl = this.el;
    newEl.innerHTML = "";

    // игровое поле
    const gameField: HTMLElement = getGameFieldElement();
    newEl.append(gameField);

    // панель управления
    const controlPanel: HTMLElement = this.drawControlPanel();
    newEl.append(controlPanel);

    this.el = newEl;
    this.updateGameState(this.gameState);
  }

  public updateGameField(cellStates: CellState[][]): void {
    this.gameState.height = cellStates.length;
    this.gameState.width = cellStates[0].length;

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

    const filedElement = getGameFieldElement(this.el);
    filedElement.innerHTML = `<table>${table}</table>`;

    if (this.cbCellClick) {
      const cellChange: FieldCellChange = this.cbCellClick;
      filedElement.addEventListener("click", (ev) => {
        const target = ev.target as HTMLElement;
        if (target.matches(".cell[data-y][data-x]")) {
          const y = Number(target.getAttribute("data-y"));
          const x = Number(target.getAttribute("data-x"));
          cellChange(y, x);
        }
      });
    }
  }

  public updateGameState(state: GameState): void {
    this.gameState = state;

    getElementSizeY(this.el).value = `${this.gameState.height}`;

    getElementSizeX(this.el).value = `${this.gameState.width}`;

    getElementStepDuration(this.el).value = `${this.gameState.stepMs}`;

    const buttonPlay = getElementTogglePlay(this.el);
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
  public onStepDurationChange(cb: StepDurationChange): void {
    this.cbStepDurationChange = cb;
  }
}
