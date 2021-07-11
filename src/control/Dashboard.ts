import { GameField } from "../model/GameField";
import {
  IDashboardView,
  MSG_NEW_CARD,
  MSG_CLOSE_CARD,
} from "../view/DashboardView";
import { GameView } from "../view/GameView";
import { Game } from "./Game";

const TEMPLATE_GLIDER: number[][] = [
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

export class Dashboard {
  private genId = 0;
  private boardView: IDashboardView;

  constructor(boardView: IDashboardView) {
    this.boardView = boardView;

    this.initBoardView();
    this.addGame();
  }

  private initBoardView() {
    this.boardView.onStateChange((msgID: number, data): void => {
      this.changeState(msgID, data);
    });
  }

  private addGame(name?: string) {
    const cardID = `Game${(this.genId += 1)}`;
    const cardName = name || `Game ${this.genId}`;

    this.boardView.addGameCard(cardID, cardName);

    const gameEl = this.boardView.getGameViewElement(cardID) as HTMLElement;
    const gameField = new GameField(1);
    const gameView = new GameView(gameEl);

    new Game(gameField, gameView).applyTemplate(TEMPLATE_GLIDER);
  }

  private removeGame(cardID: string) {
    this.boardView.removeGameCard(cardID);
  }

  public changeState(msgID: number, data?: string): void {
    switch (msgID) {
      default:
        return;
      case MSG_NEW_CARD:
        this.addGame();
        break;
      case MSG_CLOSE_CARD:
        if (data) {
          this.removeGame(data);
        }
    }
  }
}
