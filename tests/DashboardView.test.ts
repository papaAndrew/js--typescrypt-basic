import {
  DashboardView,
  MSG_CLOSE_CARD,
  MSG_NEW_CARD,
} from "../src/view/DashboardView";

let domMain: HTMLElement;
let boardView: DashboardView;

describe("Dashboard", () => {
  beforeEach(() => {
    document.body.innerHTML = `<header class="header"></header><main class="main"></main>`;

    domMain = document.querySelector(".main") as HTMLElement;

    boardView = new DashboardView(domMain);
  });

  describe("public interface", () => {
    it("is a class", () => {
      expect(DashboardView).toBeInstanceOf(Function);
      expect(boardView).toBeInstanceOf(DashboardView);
    });

    it("has public methods", () => {
      expect(boardView.addGameCard).toBeInstanceOf(Function);
      expect(boardView.removeGameCard).toBeInstanceOf(Function);
      expect(boardView.onStateChange).toBeInstanceOf(Function);
      expect(boardView.getGameViewElement).toBeInstanceOf(Function);
    });

    it("renders some initial markup on construction", () => {
      expect(domMain.querySelector("div.game-card")).not.toBeNull();
      expect(
        domMain.querySelector("div.game-card.control-panel")
      ).not.toBeNull();

      expect(
        domMain.querySelector("div.game-card.control-panel button.add-game")
          ?.innerHTML
      ).toBe("+");
    });
  });

  describe("functional interface", () => {
    it("calls listener on button Add_Game click", () => {
      const onButtonClick = jest.fn();
      boardView.onStateChange(onButtonClick);

      domMain
        .querySelector("div.game-card.control-panel button.add-game")
        ?.dispatchEvent(
          new Event("click", {
            bubbles: true,
          })
        );
      expect(onButtonClick).toHaveBeenCalledWith(MSG_NEW_CARD);
    });

    it("addGameCard() renders new card containing caption, button Close and game filed", () => {
      boardView.addGameCard("card-1", "Card 1");
      const gameCard = domMain.querySelector("#card-1");

      expect(gameCard).not.toBeNull();
      expect(gameCard?.querySelector(".card-caption")).not.toBeNull();
      expect(gameCard?.querySelector(".card-caption")?.innerHTML).toBe(
        "Card 1"
      );
      expect(gameCard?.querySelector(".card-close")).not.toBeNull();
      expect(gameCard?.querySelector(".game-view")).not.toBeNull();
    });

    it("calls listener on button Close_Game click", () => {
      const onButtonClick = jest.fn();
      boardView.onStateChange(onButtonClick);

      const cardID = "some-card";
      boardView.addGameCard(cardID);

      const gameCard: HTMLElement = domMain.querySelector(
        "#some-card"
      ) as HTMLElement;

      gameCard.querySelector(".card-close")?.dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onButtonClick).toHaveBeenCalledWith(MSG_CLOSE_CARD, cardID);
    });

    it(".removeCard(id) deletes the specified element", () => {
      const cardID = "card-to-delete";
      boardView.addGameCard(cardID);

      expect(domMain.querySelector(`#${cardID}`)).not.toBeNull();

      boardView.removeGameCard(cardID);
      expect(domMain.querySelector(`#${cardID}`)).toBeNull();
    });

    it(".getGamefield(id) returns cell to render single game", () => {
      const cardID = "single-game";
      boardView.addGameCard(cardID);

      expect(domMain.querySelector(`#${cardID}`)).not.toBeNull();

      const gameField = boardView.getGameViewElement(cardID);
      expect(gameField).not.toBeNull();
      expect(gameField?.innerHTML).toBe("");
    });
  });
});
