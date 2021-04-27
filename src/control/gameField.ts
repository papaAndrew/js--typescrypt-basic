import {
  Cell,
  getMatrix,
  getNextGeneration,
  toggleCellState,
} from "../lib/utils";

export interface IGameField {
  getState(): Cell[][];
  toggleCellState(y: number, x: number): void;
  nextGeneration(): void;
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
    this.field = getMatrix(height, width || 0);
  }

  /**
   * Текущее состояние игровой матрицы
   * @returns игровая матрица
   */
  public getState(): Cell[][] {
    return this.field;
  }

  /**
   * Задает/изменяет размер матрицы
   * @param y
   * @param x
   */
  public setSize(h: number, w: number): void {
    const currentField: Cell[][] = this.getState();

    this.field = getMatrix(h, w).map((line: Cell[], y: number) =>
      line.map((cell: Cell, x: number) =>
        currentField[y][x] ? currentField[y][x] : cell
      )
    );
  }

  /**
   * Переключает состояние ячейки живая/неживая
   * @param y
   * @param x
   */
  public toggleCellState(y: number, x: number): void {
    this.field[y][x] = toggleCellState(this.field[y][x]);
  }

  /**
   * рассчитывает и устанавливает следующее состояние поля
   */
  public nextGeneration(): void {
    this.field = getNextGeneration(this.field);
  }
}
