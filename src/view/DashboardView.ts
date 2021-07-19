export const MSG_NEW_CARD = 1;
export const MSG_CLOSE_CARD = 2;

export type StateChangeEvent = (msgID: number, data?: string) => void;

export interface IDashboardView {
  addGameCard(id: string, caption?: string): void;
  removeGameCard(id: string): void;
  getGameViewElement(id: string): HTMLElement | null;
  onStateChange(listener: StateChangeEvent): void;
}

function getElement<T extends HTMLElement>(
  selector: string,
  el?: HTMLElement
): T {
  if (el) {
    return el.querySelector(selector) as T;
  } else {
    const [elName, ...classNames] = selector.split(".");
    const el: T = document.createElement(elName) as T;
    el.classList.add(...classNames);
    return el;
  }
}
function getGameCardElement(el?: HTMLElement): HTMLDivElement {
  return getElement<HTMLDivElement>("div.game-card", el);
}
function getButtonAddGameElement(el?: HTMLElement): HTMLButtonElement {
  return getElement<HTMLButtonElement>("button.add-game", el);
}
function getCardHeaderElement(el?: HTMLElement): HTMLDivElement {
  return getElement<HTMLDivElement>("div.card-header", el);
}
function getCardCaptionElement(el?: HTMLElement): HTMLHeadingElement {
  return getElement<HTMLHeadingElement>("h4.card-caption", el);
}
function getCardCloseElement(el?: HTMLElement): HTMLButtonElement {
  return getElement<HTMLButtonElement>("button.card-close", el);
}
function getGameViewElement(el?: HTMLElement): HTMLDivElement {
  return getElement<HTMLDivElement>("div.game-view", el);
}

/**
 * Dashboard
 */
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
