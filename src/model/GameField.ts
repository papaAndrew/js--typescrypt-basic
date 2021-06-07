import {
  Cell,
  CellState,
  getMatrix,
  toggleCellState,
  getNextGeneration,
} from "./utils";

export interface IGameField {
  getState(): CellState[][];
  toggleCell(y: number, x: number): void;
  nextGeneration(): CellState[][];
  setSize(height: number, width: number): void;
}

export class GameField implements IGameField {
  /**
   * Игровая двумерная матрица
   */
  private field: Cell[][] = [];

  /**
   * создает пустую матрицу элементов Cell размером height * width
   * @param width
   * @param height
   */
  constructor(height = 1, width?: number) {
    this.setSize(height, width || 0);
  }

  /**
   * Текущее состояние игровой матрицы
   * @returns матрица состояний
   */
  public getState(): CellState[][] {
    return this.field.map((line: Cell[]) =>
      line.map((cell: Cell) => cell.state)
    );
  }

  /**
   * Задает/изменяет размер матрицы
   * @param y
   * @param x
   */
  public setSize(h: number, w: number): void {
    const currentField: Cell[][] = this.field;
    const newField = getMatrix(h, w);

    if (currentField.length) {
      this.field = newField.map((line: Cell[], y: number) =>
        currentField[y]
          ? line.map((cell: Cell, x: number) =>
              currentField[y][x]
                ? Object.assign(cell, currentField[y][x])
                : cell
            )
          : line
      );
    } else {
      this.field = newField;
    }
  }

  /**
   * Переключает состояние ячейки живая/неживая
   * @param y
   * @param x
   */
  public toggleCell(y: number, x: number): void {
    this.field[y][x].state = toggleCellState(this.field[y][x]);
  }

  /**
   * рассчитывает и устанавливает следующее состояние поля
   */
  public nextGeneration(): CellState[][] {
    this.field = getNextGeneration(this.field);

    return this.getState();
  }

  public isAnyoneAlive(): boolean {
    for (let i = 0; i < this.field.length; i += 1) {
      const range = this.field[i];
      for (let j = 0; j < range.length; j += 1) {
        const cell = range[j];
        if (cell.state) {
          return true;
        }
      }
    }
    return false;
  }
}
