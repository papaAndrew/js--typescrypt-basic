export const MSG_NEW_CARD = 1;
export const MSG_CLOSE_CARD = 2;

export type StateChangeEvent = (msgID: number, data?: string) => void;

export interface IDashboardView {
  addGameCard(id: string, caption?: string): void;
  removeGameCard(id: string): void;
  getGameViewElement(id: string): HTMLElement | null;
  onStateChange(listener: StateChangeEvent): void;
}

function getGameCardElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector("div.game-card") as HTMLDivElement;
  } else {
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("game-card");
    return div;
  }
}

function getButtonAddGameElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector("button.add-game") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("add-game");
    return button;
  }
}

function getCardHeaderElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector(".card-header") as HTMLDivElement;
  } else {
    const div: HTMLHeadingElement = document.createElement("div");
    div.classList.add("card-header");
    return div;
  }
}
function getCardCaptionElement(el?: HTMLElement): HTMLHeadingElement {
  if (el) {
    return el.querySelector(".card-caption") as HTMLHeadingElement;
  } else {
    const hyz: HTMLHeadingElement = document.createElement("h4");
    hyz.classList.add("card-caption");
    return hyz;
  }
}
function getCardCloseElement(el?: HTMLElement): HTMLButtonElement {
  if (el) {
    return el.querySelector(".card-close") as HTMLButtonElement;
  } else {
    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("card-close");
    return button;
  }
}

function getGameViewElement(el?: HTMLElement): HTMLDivElement {
  if (el) {
    return el.querySelector(`div.game-view`) as HTMLDivElement;
  } else {
    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("game-view");
    return div;
  }
}

export class DashboardView implements IDashboardView {
  private dashBoard: HTMLElement;
  private cbStateChange: StateChangeEvent | undefined;

  constructor(patentElement: HTMLElement) {
    this.dashBoard = patentElement;

    this.addControlPanel();
  }

  private addControlPanel() {
    const newPanel = getGameCardElement();
    newPanel.classList.add("control-panel");

    const buttonAdd: HTMLElement = getButtonAddGameElement();
    buttonAdd.innerHTML = "+";
    buttonAdd.addEventListener("click", () => {
      this.cbStateChange && this.cbStateChange(MSG_NEW_CARD);
    });
    newPanel.appendChild(buttonAdd);

    this.dashBoard.appendChild(newPanel);
  }

  private getLastGameCard(): HTMLElement {
    const cards = this.dashBoard.querySelectorAll("div.game-card");
    return cards[cards.length - 1] as HTMLElement;
  }

  public addGameCard(id: string, caption?: string): void {
    const gameCard = this.getLastGameCard();
    gameCard.classList.remove("control-panel");
    gameCard.innerHTML = "";
    gameCard.id = id;

    const cardHeader = getCardHeaderElement();
    const cardName = getCardCaptionElement();
    const cardBody = getGameViewElement();
    const cardClose = getCardCloseElement();

    cardName.innerHTML = caption || `Card ${id}`;
    cardHeader.appendChild(cardName);

    cardClose.innerHTML = "X";
    cardClose.addEventListener("click", () => {
      this.cbStateChange && this.cbStateChange(MSG_CLOSE_CARD, gameCard.id);
    });

    cardHeader.appendChild(cardClose);

    gameCard.appendChild(cardHeader);
    gameCard.appendChild(cardBody);

    this.addControlPanel();
  }

  public removeGameCard(cardID: string): void {
    this.dashBoard.querySelector(`div#${cardID}.game-card`)?.remove();
  }

  public getGameViewElement(cardID: string): HTMLElement | null {
    return this.dashBoard.querySelector(
      `div#${cardID}.game-card .game-view`
    ) as HTMLElement;
  }

  public onStateChange(eventListener: StateChangeEvent): void {
    this.cbStateChange = eventListener;
  }
}
