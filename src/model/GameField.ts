import {
  CellState,
  getMatrix,
  toggleCellState,
  getNextGeneration,
  getSamrtState,
  STATE_DEAD,
} from "./utils";

export interface IGameField {
  getState(smartMode?: boolean): CellState[][];
  toggleCell(y: number, x: number): void;
  nextGeneration(smartMode?: boolean): CellState[][];
  setSize(height: number, width: number): void;
  clear(): CellState[][];
  isGameOver(): boolean;
  applyTemplate(mapState: number[][]): void;
}

export class GameField implements IGameField {
  /**
   * Игровая двумерная матрица
   */
  private fieldState: CellState[][] = [];

  private nextState: CellState[][] = [];

  /**
   * создает пустую матрицу элементов Cell размером height * width
   * @param width
   * @param height
   */
  constructor(height = 1, width?: number) {
    this.setSize(height, width || 0);
  }

  private updateNextState() {
    this.nextState = getNextGeneration(this.fieldState);
  }

  private getSamrtState(): CellState[][] {
    return this.fieldState.map((line: CellState[], y: number) =>
      line.map((cellState: CellState, x: number) =>
        getSamrtState(cellState, this.nextState[y][x] || STATE_DEAD)
      )
    );
  }
  /**
   * Текущее состояние игровой матрицы
   * @returns матрица состояний
   */
  public getState(smartMode?: boolean): CellState[][] {
    return smartMode || false ? this.getSamrtState() : this.fieldState;
  }

  /**
   * Очистка игровоего поля от живых клеток
   */
  public clear(): CellState[][] {
    const height = this.fieldState.length;
    const width = this.fieldState[0].length;

    this.fieldState = getMatrix(height, width);
    this.updateNextState();
    return this.getState();
  }
  /**
   * Задает/изменяет размер матрицы
   * @param y
   * @param x
   */
  public setSize(h: number, w: number): void {
    const newField: CellState[][] = getMatrix(
      h,
      w
    ).map((line: CellState[], y: number) =>
      this.fieldState[y]
        ? line.map(
            (cellState: CellState, x: number) =>
              this.fieldState[y][x] || cellState
          )
        : line
    );
    this.fieldState = newField;
    this.updateNextState();
  }

  /**
   * Переключает состояние ячейки живая/неживая
   * @param y
   * @param x
   */
  public toggleCell(y: number, x: number): void {
    this.fieldState[y][x] = toggleCellState(this.fieldState[y][x]);
    this.updateNextState();
  }

  /**
   * рассчитывает и устанавливает следующее состояние поля
   */
  public nextGeneration(smartMode?: boolean): CellState[][] {
    this.fieldState = this.nextState;
    this.updateNextState();

    return this.getState(smartMode);
  }

  public isGameOver(): boolean {
    return (
      this.fieldState.filter(
        (line: CellState[], y) =>
          line.filter(
            (cellState: CellState, x) => cellState !== this.nextState[y][x]
          ).length > 0
      ).length === 0
    );
  }

  public applyTemplate(mapState: number[][]): void {
    this.fieldState = mapState.map((line: number[]) =>
      line.map((state: number) => state as CellState)
    );
    this.updateNextState();
  }
}
