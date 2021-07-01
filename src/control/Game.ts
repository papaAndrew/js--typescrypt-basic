import { IGameField } from "../model/GameField";
import { GameState, IGameView } from "../view/GameView";
import { CellState } from "../model/utils";

const INITIAL_STATE: CellState[][] = [
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export class Game {
  private gameField: IGameField;
  private gameView: IGameView;

  private gameState: GameState = {
    isPlaying: false,
    isPaused: false,
    stepMs: 1000,
  };

  //  private gameStatus: number = GS_STOPED;
  private isPlaying = false;

  constructor(gameField: IGameField, gameView: IGameView, stepMs = 1000) {
    this.gameView = gameView;
    this.initGameView();

    this.gameField = gameField;
    this.initGameField();

    this.gameState.stepMs = stepMs;
    this.gameView.updateGameState(this.gameState);
    this.gameView.updateGameField(this.gameField.getState());
  }

  private initGameField() {
    const [h, w] = [INITIAL_STATE.length, INITIAL_STATE[0]?.length || 0];
    this.gameField.setSize(h, w);

    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        if (INITIAL_STATE[y][x]) {
          this.gameField.toggleCell(y, x);
        }
      }
    }
  }

  private initGameView() {
    this.gameView.onCellClick((row: number, col: number) => {
      this.cellClick(row, col);
    });

    this.gameView.onGameStateChange((newState: Partial<GameState>) => {
      this.gameStateChange(newState);
    });

    this.gameView.onFieldSizeChange((height: number, width: number) => {
      this.fieldSizeChange(height, width);
    });
  }

  private cellClick(row: number, col: number) {
    this.gameField.toggleCell(row, col);
    this.gameView.updateGameField(this.gameField.getState());
  }

  private gameStateChange(state: Partial<GameState>) {
    this.gameState = { ...this.gameState, ...state };
    if (!this.gameState.isPlaying) {
      this.gameState.isPaused = false;
    }

    if (this.gameState.isPlaying && !this.gameState.isPaused) {
      this.start();
    }

    this.gameView.updateGameState(this.gameState);
  }

  private fieldSizeChange(height: number, width: number) {
    this.gameField.setSize(height, width);
    this.gameView.updateGameField(this.gameField.getState());
  }

  private start() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;

    const play = () => {
      if (!this.gameState.isPlaying || this.gameState.isPaused) {
        this.isPlaying = false;
        return;
      }

      this.gameView.updateGameField(this.gameField.nextGeneration());

      setTimeout(play, this.gameState.stepMs);
    };
    play();
  }
}
