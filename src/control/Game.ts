import { IGameField } from "../model/GameField";
import { GameState, IGameView } from "../view/GameView";

export class Game {
  private gameField: IGameField;
  private gameView: IGameView;

  private gameState: GameState = {
    isPlaying: false,
    smartMode: true,
    gameOver: false,
    clearField: false,
    stepMs: 1000,
    caption: "",
  };

  constructor(gameField: IGameField, gameView: IGameView, stepMs?: number) {
    this.gameView = gameView;
    this.initGameView();

    this.gameField = gameField;
    this.initGameField();

    this.gameState.stepMs = stepMs || 1000;

    this.gameView.updateGameState(this.gameState);
    this.gameView.updateGameField(
      this.gameField.getState(this.gameState.smartMode)
    );
  }

  private initGameField() {
    this.gameField.setSize(1, 0);
  }

  private initGameView() {
    // listeners must be row function only.
    this.gameView.onCellClick((row, col) => this.cellClick(row, col));

    this.gameView.onGameStateChange((gameState) =>
      this.gameStateChange(gameState)
    );

    this.gameView.onFieldSizeChange((height, width) =>
      this.fieldSizeChange(height, width)
    );
  }

  private cellClick(row: number, col: number) {
    this.gameField.toggleCell(row, col);
    this.gameView.updateGameField(
      this.gameField.getState(this.gameState.smartMode)
    );
    this.gameStateChange({ gameOver: this.gameField.isGameOver() });
  }

  private toggleIsPlaying() {
    if (this.gameState.isPlaying) {
      this.gameState.isPlaying = !this.gameState.isPlaying;
      return;
    }
    this.start();
  }

  private setGameSpeed(newValue: number) {
    this.gameState.stepMs = newValue;
  }
  private setGameOver(gameOver: boolean) {
    this.gameState.gameOver = gameOver;

    if (this.gameState.gameOver) {
      this.gameState.isPlaying = false;
      this.gameState.caption = "Game over!";
    }
  }

  private setClearField(clearField: boolean) {
    this.gameState.clearField = clearField;
    if (!this.gameState.clearField) {
      return;
    }

    if (this.gameState.isPlaying) {
      this.gameState.isPlaying = false;
      this.gameState.caption = "To clear field press Clear again please";
    } else {
      this.gameView.updateGameField(this.gameField.clear());
    }
  }

  private gameStateChange(gameState: Partial<GameState>) {
    this.gameState = {
      ...this.gameState,
      gameOver: false,
      clearField: false,
      caption: "",
    };

    if ("isPlaying" in gameState) {
      this.toggleIsPlaying();
    }
    if ("stepMs" in gameState) {
      this.setGameSpeed(gameState.stepMs || 0);
    }
    if ("gameOver" in gameState) {
      this.setGameOver(gameState.gameOver || false);
    }
    if ("clearField" in gameState) {
      this.setClearField(gameState.clearField || false);
    }

    this.gameView.updateGameState(this.gameState);
  }

  private fieldSizeChange(height: number, width: number) {
    this.gameField.setSize(height, width);
    this.gameView.updateGameField(
      this.gameField.getState(this.gameState.smartMode)
    );
    this.gameStateChange({ gameOver: this.gameField.isGameOver() });
  }

  private start() {
    if (this.gameState.isPlaying) {
      return;
    }
    this.gameState.isPlaying = true;

    const play = () => {
      if (!this.gameState.isPlaying) {
        return;
      }
      this.gameView.updateGameField(
        this.gameField.nextGeneration(this.gameState.smartMode)
      );
      if (this.gameField.isGameOver()) {
        this.gameStateChange({ gameOver: true });
      }

      setTimeout(play, this.gameState.stepMs);
    };
    play();
  }

  public applyTemplate(mapState: number[][]): void {
    this.gameField.applyTemplate(mapState);
    this.gameView.updateGameField(
      this.gameField.getState(this.gameState.smartMode)
    );
  }
}
