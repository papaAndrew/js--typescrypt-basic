import { IGameField } from "../model/GameField";
import { GameState, IGameView } from "../view/GameView";
import { CellState } from "../model/utils";

export class Game {
  private isPlaying = false;

  private stepDuration = 1000;

  private gameField: IGameField;
  private gameView: IGameView;

  constructor(
    gameField: IGameField,
    gameView: IGameView,
    stepDuration?: number
  ) {
    this.gameField = gameField;
    this.gameView = gameView;
    this.setStepDuration(stepDuration);

    this.gameView.onFieldSizeChange((height: number, width: number) => {
      this.fieldSizeChange(height, width);
    });

    this.gameView.onCellClick((row: number, col: number) => {
      this.cellClick(row, col);
    });

    this.gameView.onGameStateChange((newState: boolean) => {
      this.gameStateChange(newState);
    });

    this.gameView.onStepDurationChange((newStep: number) => {
      this.setStepDuration(newStep);
    });

    this.updateGameState();
  }

  private cellClick(row: number, col: number) {
    this.gameField.toggleCell(row, col);
    this.updateGameState();
  }

  private gameStateChange(newState: boolean) {
    if (newState) {
      this.start();
    } else {
      this.stop();
    }
  }

  private getGameState(fieldState: CellState[][]): GameState {
    return {
      height: fieldState.length,
      width: fieldState[0].length,
      isPlaying: this.isPlaying,
      stepMs: this.stepDuration,
    };
  }

  // интерактивное изменение размера поля
  private fieldSizeChange(height: number, width: number) {
    this.gameField.setSize(height, width);
    this.updateGameState();
  }

  private updateGameState() {
    const fieldState: CellState[][] = this.gameField.getState();
    const gameState: GameState = this.getGameState(fieldState);

    this.gameView.updateGameState(gameState);
    this.gameView.updateGameField(fieldState);
  }

  start(): void {
    this.isPlaying = true;

    const play = () => {
      if (!this.isPlaying) {
        return;
      }

      this.gameField.nextGeneration();
      this.updateGameState();

      setTimeout(play, this.stepDuration);
    };
    play();
  }

  stop(): void {
    this.isPlaying = false;
    this.updateGameState();
  }

  setStepDuration(step: number | undefined): void {
    if (step) {
      this.stepDuration = step;
    }
  }
}
